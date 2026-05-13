<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'src/composables/useTheme';
import { useLanguage } from 'src/composables/useLanguage';
import { useAuthStore } from 'src/stores/auth';
import { useCatalogsStore } from 'src/stores/catalogs';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { toggleDark } = useTheme();
const { setLanguage, locale } = useLanguage();
const authStore = useAuthStore();
const catalogsStore = useCatalogsStore();
const $q = useQuasar();

const leftDrawerOpen = ref(false);
const miniState = ref(false);

const isDark = computed(() => $q.dark.isActive);

const navItems = computed(() => [
  { icon: 'home', label: t('home'), to: '/', id: 'nav-home' },
  { icon: 'list_alt', label: t('requests'), to: '/requests', id: 'nav-requests' },
  { icon: 'add_circle_outline', label: t('createRequest'), to: '/requests/new', id: 'nav-create' },
]);

const isActiveRoute = (path: string) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

function handleLogout() {
  authStore.logout();
  void router.push('/login');
}

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
  void catalogsStore.fetchCatalogs();
});
</script>

<template>
  <q-layout view="lHh LpR lFf">
    <!-- ─── Top Toolbar ─── -->
    <q-header bordered class="glass-toolbar" :class="isDark ? 'text-white' : 'text-dark'">
      <q-toolbar class="q-py-xs">
        <!-- Hamburger (mobile) -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md"
          @click="toggleDrawer"
          :aria-label="'Toggle sidebar'"
        />

        <!-- Brand -->
        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="rocket_launch" size="28px" class="q-mr-sm" color="primary" />
          <span class="text-weight-bold gradient-text" style="font-size: 1.25rem; letter-spacing: -0.02em;">
            Go Digital
          </span>
        </q-toolbar-title>

        <q-space />

        <!-- Language Selector -->
        <q-select
          dense
          borderless
          :model-value="locale"
          @update:model-value="setLanguage"
          :options="[
            { label: '🇺🇸 EN', value: 'en-US' },
            { label: '🇲🇽 ES', value: 'es' },
          ]"
          emit-value
          map-options
          style="width: 90px"
          class="q-mr-sm"
        >
          <template v-slot:prepend>
            <q-icon name="translate" size="20px" />
          </template>
        </q-select>

        <!-- Dark Mode Toggle -->
        <q-btn
          flat
          round
          dense
          :icon="isDark ? 'light_mode' : 'dark_mode'"
          @click="toggleDark"
          class="q-mr-sm"
        >
          <q-tooltip>{{ t('darkMode') }}</q-tooltip>
        </q-btn>

        <!-- User Menu -->
        <q-btn flat round dense>
          <q-avatar size="36px" color="primary" text-color="white" class="text-weight-bold" style="font-size: 0.8rem;">
            {{ authStore.userInitials }}
          </q-avatar>

          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 8]"
          >
            <q-card style="min-width: 220px; border-radius: 12px;">
              <q-card-section class="row items-center no-wrap q-pb-none">
                <q-avatar size="42px" color="primary" text-color="white" class="text-weight-bold q-mr-sm" style="font-size: 0.9rem;">
                  {{ authStore.userInitials }}
                </q-avatar>
                <div>
                  <div class="text-weight-bold" style="font-size: 0.9rem;">{{ authStore.userName }}</div>
                  <div class="text-caption" style="opacity: 0.6;">{{ authStore.user?.email }}</div>
                </div>
              </q-card-section>
              <q-separator class="q-my-sm" />
              <q-card-actions vertical>
                <q-btn
                  flat
                  no-caps
                  align="left"
                  icon="logout"
                  :label="t('logout')"
                  color="negative"
                  @click="handleLogout"
                  class="full-width"
                />
              </q-card-actions>
            </q-card>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- ─── Sidebar ─── -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      :width="260"
      :mini-width="72"
      bordered
      class="glass-sidebar"
    >
      <q-scroll-area class="fit">
        <!-- Mini toggle -->
        <div class="q-pa-sm text-right gt-sm">
          <q-btn
            flat
            round
            dense
            size="sm"
            :icon="miniState ? 'chevron_right' : 'chevron_left'"
            @click="miniState = !miniState"
          />
        </div>

        <!-- Nav Items -->
        <q-list class="q-px-sm q-mt-xs" style="gap: 4px; display: flex; flex-direction: column;">
          <q-item
            v-for="item in navItems"
            :key="item.id"
            clickable
            :to="item.to"
            :active="isActiveRoute(item.to)"
            active-class="nav-item-active"
            class="nav-item"
            style="border-radius: 12px; min-height: 48px;"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" size="22px" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="font-weight: 500; font-size: 0.9rem;">{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Bottom spacer + version -->
        <div v-if="!miniState" class="absolute-bottom q-pa-md" style="opacity: 0.4;">
          <div class="text-caption text-center">Go Digital v1.0</div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- ─── Main Content ─── -->
    <q-page-container>
      <div class="bg-orbs"></div>
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.nav-item {
  transition: all 0.2s ease;
  margin-bottom: 2px;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    background: rgba(99, 102, 241, 0.08);
  }
}

.nav-item-active {
  opacity: 1;
  background: rgba(99, 102, 241, 0.12) !important;
  color: #6366f1;

  .q-icon {
    color: #6366f1;
  }
}

body.body--dark {
  .nav-item-active {
    background: rgba(99, 102, 241, 0.2) !important;
  }
}
</style>
