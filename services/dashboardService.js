import apiClient from "./apiClient";

/**
 * Načíst rozšířený přehled skladu.
 */
export const getDashboardOverview = async ({ clientId }) => {
  const response = await apiClient.get("/dashboard/overview/", {
    params: {
      clientId,
    },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Načíst seznam alertů (pro nízké zásoby).
 */
export const getDashboardAlerts = async ({ clientId }) => {
  const response = await apiClient.get("/dashboard/alerts/", {
    params: {
      clientId,
    },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Načíst produkty s nízkými zásobami.
 */
export const getDashboardLowStock = async ({ clientId }) => {
  const response = await apiClient.get("/dashboard/low_stock/", {
    params: {
      clientId,
    },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Načíst nedávnou aktivitu s možností filtrování podle období a typu aktivity.
 */
export const getDashboardRecentActivity = async ({
  clientId,
  filters = {},
}) => {
  const response = await apiClient.get(`/dashboard/recent_activity/`, {
    params: {
      clientId,
      filters,
    },
    withCredentials: true,
  });
  return response.data;
};
/**
 * Načíst aktivní operace.
 */
export const getDashboardActiveOperations = async ({ clientId }) => {
  const response = await apiClient.get("/dashboard/active_operations/", {
    params: {
      clientId,
    },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Načíst statistiky operací s možností filtrování podle období.
 */
export const getDashboardStats = async ({ clientId, filters = {} }) => {
  const response = await apiClient.get("/dashboard/stats/", {
    params: {
      clientId,
      filters,
    },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Načíst efektivitu skladu.
 */
export const getDashboardEfficiency = async ({ clientId }) => {
  const response = await apiClient.get("/dashboard/efficiency/", {
    params: {
      clientId,
    },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Načíst rozšířené statistiky operací.
 */
export const getDashboardExtendedStats = async ({ clientId }) => {
  const response = await apiClient.get("/dashboard/extended_stats/", {
    params: {
      clientId,
    },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Načíst konfiguraci widgetů uživatele.
 */
export const getUserWidgets = async () => {
  const response = await apiClient.get("/dashboard/my_widgets/", {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Uložit konfiguraci widgetů uživatele.
 */
export const saveUserWidgets = async (widgets) => {
  const response = await apiClient.post(
    "/dashboard/save_widgets/",
    { widgets },
    { withCredentials: true }
  );
  return response.data;
};
