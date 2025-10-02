import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Info } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/usages")({
  component: UsagePage,
});

// Mock data for usage statistics
const usageData = {
  creditsUsed: 2,
  creditsTotal: 100,
  chatbotsUsed: 1,
  chatbotsTotal: 1,
  usageHistory: [
    { date: "Aug 1", messages: 0 },
    { date: "Aug 2", messages: 0 },
    { date: "Aug 3", messages: 0 },
    { date: "Aug 4", messages: 0 },
    { date: "Aug 5", messages: 0 },
    { date: "Aug 6", messages: 0 },
    { date: "Aug 7", messages: 0 },
    { date: "Aug 8", messages: 0 },
    { date: "Aug 9", messages: 0 },
    { date: "Aug 10", messages: 0 },
    { date: "Aug 11", messages: 2 },
    { date: "Aug 12", messages: 2 },
  ],
  creditsByBot: [
    { name: "Suporte ao Cliente", credits: 1, color: "hsl(217, 91%, 60%)" },
    { name: "Assistente de Vendas", credits: 1, color: "hsl(262, 83%, 58%)" },
  ],
};

function UsagePage() {
  const creditsPercentage = (usageData.creditsUsed / usageData.creditsTotal) * 100;
  const chatbotsPercentage = (usageData.chatbotsUsed / usageData.chatbotsTotal) * 100;

  return (
    <div className="p-4 md:p-8 space-y-8 pt-4 md:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Usage</h1>
        <div className="flex items-center gap-4">
          <Select defaultValue="all-chatbots">
            <SelectTrigger className="flex h-12 w-48 rounded-xl border-2 border-input bg-background px-4 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:ring-offset-0 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-chatbots">Todos os chatbots</SelectItem>
              <SelectItem value="suporte">Suporte ao Cliente</SelectItem>
              <SelectItem value="vendas">Assistente de Vendas</SelectItem>
              <SelectItem value="faq">FAQ Inteligente</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <input
              type="text"
              readOnly
              value="01 Ago, 2025 - 18 Ago, 2025"
              className="flex h-12 w-64 rounded-xl border-2 border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer"
            />
            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsageCard
          title="Créditos utilizados"
          used={usageData.creditsUsed}
          total={usageData.creditsTotal}
          percentage={creditsPercentage}
          showInfo={true}
        />
        <UsageCard
          title="Chatbots ativos"
          used={usageData.chatbotsUsed}
          total={usageData.chatbotsTotal}
          percentage={chatbotsPercentage}
        />
      </div>

      {/* Usage History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Histórico de uso</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Mensagens processadas nos últimos 30 dias
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer
            config={{
              messages: {
                label: "Mensagens",
                color: "hsl(217, 91%, 60%)",
              },
            }}
            className="h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={usageData.usageHistory}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  angle={0}
                  textAnchor="middle"
                  height={60}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  width={60}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar
                  dataKey="messages"
                  fill="var(--color-messages)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Credits used per chatbot */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Créditos utilizados por chatbot</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Distribuição do consumo de créditos entre chatbots
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
            {/* Chart Container */}
            <div className="flex-shrink-0">
              <ChartContainer
                config={{
                  "suporte-cliente": {
                    label: "Suporte ao Cliente",
                    color: "hsl(217, 91%, 60%)",
                  },
                  "assistente-vendas": {
                    label: "Assistente de Vendas",
                    color: "hsl(262, 83%, 58%)",
                  },
                }}
                className="w-80 h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usageData.creditsByBot.map((bot) => ({
                        name: bot.name,
                        value: bot.credits,
                        fill:
                          bot.name === "Suporte ao Cliente"
                            ? "hsl(217, 91%, 60%)"
                            : "hsl(262, 83%, 58%)",
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={130}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={3}
                      stroke="hsl(var(--background))"
                    >
                      {usageData.creditsByBot.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Suporte ao Cliente"
                              ? "hsl(217, 91%, 60%)"
                              : "hsl(262, 83%, 58%)"
                          }
                        />
                      ))}
                    </Pie>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Legend - Melhorada */}
            <div className="flex flex-col gap-4 min-w-[320px]">
              {usageData.creditsByBot.map((bot, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-5 h-5 rounded-full shadow-sm ring-2 ring-background"
                    style={{
                      backgroundColor: index === 0 ? "hsl(217, 91%, 60%)" : "hsl(262, 83%, 58%)",
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-base">{bot.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {bot.credits} créditos utilizados
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-foreground">{bot.credits}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">50%</p>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="mt-4 pt-4 border-t-2">
                <div className="flex items-center justify-between p-2">
                  <span className="text-base font-semibold text-muted-foreground">
                    Total de créditos
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    {usageData.creditsByBot.reduce((acc, bot) => acc + bot.credits, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                chatbot: "Suporte ao Cliente",
                messages: 134,
                time: "1 hora atrás",
                status: "ativo",
              },
              {
                chatbot: "Assistente de Vendas",
                messages: 89,
                time: "3 horas atrás",
                status: "ativo",
              },
              {
                chatbot: "FAQ Inteligente",
                messages: 45,
                time: "5 horas atrás",
                status: "inativo",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.status === "ativo" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-foreground">{activity.chatbot}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.messages} mensagens • {activity.time}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground capitalize">{activity.status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsageCard({
  title,
  used,
  total,
  percentage,
  showInfo = false,
}: {
  title: string;
  used: number;
  total: number;
  percentage: number;
  showInfo?: boolean;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Progress Circle */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-in-out"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm text-muted-foreground">{title}</h3>
              {showInfo && <Info className="w-4 h-4 text-muted-foreground" />}
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">
                {used}
                <span className="text-lg text-muted-foreground">/{total}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
