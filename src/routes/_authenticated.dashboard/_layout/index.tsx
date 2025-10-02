import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/chatbots" });
  },
  component: DashboardOverview,
});

function DashboardOverview() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Chatbots</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Conversas Ativas</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">156</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Mensagens Hoje</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">2.4k</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Taxa de Sucesso</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">94%</p>
        </div>
      </div>
    </div>
  );
}
