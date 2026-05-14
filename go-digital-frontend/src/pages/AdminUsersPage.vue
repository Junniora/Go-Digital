<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNotify } from 'src/composables/useNotify';
import { useCatalogsStore } from 'src/stores/catalogs';
import { apiGet, apiPost, apiDelete } from 'src/services/api';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  departmentId: number;
}

const notify = useNotify();
const catalogsStore = useCatalogsStore();

const users = ref<UserRecord[]>([]);
const loading = ref(false);
const creating = ref(false);
const showDialog = ref(false);
const showDeleteDialog = ref(false);
const userToDelete = ref<UserRecord | null>(null);

// Form fields
const form = ref({
  name: '',
  email: '',
  password: '',
  role: '',
  departmentId: null as number | null,
});

const roleOptions = [
  { label: 'Usuario (solicita)', value: 'user' },
  { label: 'Equipo DX (gestiona)', value: 'dx_team' },
  { label: 'Administrador', value: 'admin' },
];

const roleColor: Record<string, string> = {
  admin: 'deep-purple',
  dx_team: 'primary',
  user: 'grey-6',
};

const roleIcon: Record<string, string> = {
  admin: 'admin_panel_settings',
  dx_team: 'engineering',
  user: 'person',
};

async function fetchUsers() {
  loading.value = true;
  try {
    users.value = await apiGet<UserRecord[]>('/users');
  } catch {
    notify.error('Error al cargar los usuarios.');
  } finally {
    loading.value = false;
  }
}

async function handleCreate() {
  if (!form.value.name || !form.value.email || !form.value.password || !form.value.role || !form.value.departmentId) {
    notify.error('Completa todos los campos.');
    return;
  }
  creating.value = true;
  try {
    const newUser = await apiPost<UserRecord>('/users', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role,
      departmentId: form.value.departmentId,
    });
    users.value.push(newUser);
    notify.success(`Usuario "${newUser.name}" creado correctamente.`);
    showDialog.value = false;
    resetForm();
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      ?? 'Error al crear el usuario.';
    notify.error(msg);
  } finally {
    creating.value = false;
  }
}

function confirmDelete(user: UserRecord) {
  userToDelete.value = user;
  showDeleteDialog.value = true;
}

async function handleDelete() {
  if (!userToDelete.value) return;
  try {
    await apiDelete(`/users/${userToDelete.value.id}`);
    users.value = users.value.filter((u) => u.id !== userToDelete.value!.id);
    notify.success('Usuario eliminado.');
    showDeleteDialog.value = false;
    userToDelete.value = null;
  } catch {
    notify.error('No se pudo eliminar el usuario.');
  }
}

function resetForm() {
  form.value = { name: '', email: '', password: '', role: '', departmentId: null };
}

onMounted(async () => {
  await Promise.all([fetchUsers(), catalogsStore.fetchCatalogs()]);
});
</script>

<template>
  <q-page class="q-pa-md">
    <div class="container-wide">

      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <h1 class="section-title q-mb-xs">Gestión de Usuarios</h1>
          <p class="section-subtitle">Administra los accesos al sistema Go Digital</p>
        </div>
        <q-btn
          unelevated no-caps
          color="primary"
          icon="person_add"
          label="Nuevo Usuario"
          style="border-radius: 10px;"
          @click="showDialog = true"
        />
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="row q-gutter-md">
        <q-skeleton v-for="i in 4" :key="i" type="rect" height="80px" class="col-12" style="border-radius: 12px;" />
      </div>

      <!-- Users table -->
      <q-card v-else flat class="glass-card-static" style="border-radius: 16px; overflow: hidden;">
        <q-markup-table flat separator="horizontal">
          <thead>
            <tr>
              <th class="text-left">Usuario</th>
              <th class="text-left">Email</th>
              <th class="text-left">Rol</th>
              <th class="text-left">Departamento</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length === 0">
              <td colspan="5" class="text-center q-pa-xl" style="opacity: 0.5;">
                <q-icon name="group_off" size="48px" class="q-mb-sm" /><br>
                No hay usuarios registrados.
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id">
              <!-- Name + avatar -->
              <td>
                <div class="row items-center q-gutter-sm no-wrap">
                  <q-avatar size="36px" :color="roleColor[user.role] ?? 'grey-5'" text-color="white"
                    style="font-size: 0.75rem; font-weight: 700;">
                    {{ user.name.split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2) }}
                  </q-avatar>
                  <span class="text-weight-medium">{{ user.name }}</span>
                </div>
              </td>
              <td style="opacity: 0.7;">{{ user.email }}</td>
              <!-- Role badge -->
              <td>
                <q-chip dense :color="roleColor[user.role] ?? 'grey'" text-color="white"
                  :icon="roleIcon[user.role] ?? 'person'" style="font-size: 0.75rem;">
                  {{ roleOptions.find(r => r.value === user.role)?.label ?? user.role }}
                </q-chip>
              </td>
              <td>{{ user.department }}</td>
              <!-- Delete -->
              <td class="text-right">
                <q-btn flat round dense icon="delete_outline" color="negative" size="sm"
                  @click="confirmDelete(user)">
                  <q-tooltip>Eliminar usuario</q-tooltip>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>

      <!-- Total count -->
      <div v-if="!loading && users.length > 0" class="q-mt-sm text-caption" style="opacity: 0.5;">
        {{ users.length }} usuario{{ users.length !== 1 ? 's' : '' }} registrado{{ users.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- ─── Delete Confirm Dialog ─── -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="border-radius: 16px; min-width: 320px;">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="warning" color="negative" size="28px" class="q-mr-sm" />
          <span class="text-weight-bold">¿Eliminar usuario?</span>
        </q-card-section>
        <q-card-section style="opacity: 0.7;">
          Esta acción no se puede deshacer. El usuario
          <strong>{{ userToDelete?.name }}</strong> perderá acceso al sistema.
        </q-card-section>
        <q-card-actions align="right" class="q-pb-md q-px-md">
          <q-btn flat no-caps label="Cancelar" @click="showDeleteDialog = false" />
          <q-btn unelevated no-caps color="negative" label="Eliminar"
            style="border-radius: 8px;" @click="handleDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ─── Create User Dialog ─── -->
    <q-dialog v-model="showDialog" @hide="resetForm" persistent>
      <q-card style="border-radius: 20px; width: 480px; max-width: 95vw;">
        <q-card-section class="row items-center q-pb-none q-pt-lg q-px-lg">
          <q-icon name="person_add" color="primary" size="28px" class="q-mr-sm" />
          <span class="text-h6 text-weight-bold">Nuevo Usuario</span>
          <q-space />
          <q-btn flat round dense icon="close" @click="showDialog = false; resetForm()" />
        </q-card-section>

        <q-card-section class="q-px-lg q-pb-lg q-pt-md">
          <div class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="Nombre completo"
              outlined dense
              :rules="[(v: string) => !!v || 'Requerido']"
              lazy-rules
            >
              <template v-slot:prepend><q-icon name="person" /></template>
            </q-input>

            <q-input
              v-model="form.email"
              label="Correo electrónico"
              type="email"
              outlined dense
              :rules="[(v: string) => !!v || 'Requerido', (v: string) => /.+@.+/.test(v) || 'Email inválido']"
              lazy-rules
            >
              <template v-slot:prepend><q-icon name="email" /></template>
            </q-input>

            <q-input
              v-model="form.password"
              label="Contraseña inicial"
              type="password"
              outlined dense
              :rules="[(v: string) => v.length >= 6 || 'Mínimo 6 caracteres']"
              lazy-rules
              hint="El usuario debería cambiarla en su primer acceso"
            >
              <template v-slot:prepend><q-icon name="lock" /></template>
            </q-input>

            <q-select
              v-model="form.role"
              :options="roleOptions"
              emit-value map-options
              label="Rol"
              outlined dense
              :rules="[(v: string) => !!v || 'Requerido']"
              lazy-rules
            >
              <template v-slot:prepend><q-icon name="admin_panel_settings" /></template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="roleIcon[scope.opt.value] ?? 'person'" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              v-model="form.departmentId"
              :options="catalogsStore.departmentOptions"
              emit-value map-options
              label="Departamento"
              outlined dense
              :rules="[(v: number | null) => !!v || 'Requerido']"
              lazy-rules
            >
              <template v-slot:prepend><q-icon name="business" /></template>
            </q-select>
          </div>
        </q-card-section>

        <q-card-actions class="q-px-lg q-pb-lg" align="right">
          <q-btn flat no-caps label="Cancelar" @click="showDialog = false; resetForm()" />
          <q-btn
            unelevated no-caps
            color="primary"
            icon="check"
            label="Crear Usuario"
            style="border-radius: 10px;"
            :loading="creating"
            @click="handleCreate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
