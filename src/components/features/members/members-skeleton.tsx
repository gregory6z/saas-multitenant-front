import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton para lista de membros (usado dentro do card)
 */
export function MembersListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => `skeleton-member-${i}`).map((key) => (
        <div key={key} className="flex items-center justify-between p-4 border rounded-xl">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton completo da página de membros (inclui todos os cards)
 */
export function MembersSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8 px-4 md:px-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Card: Convidar Membros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-10 rounded-xl" />
            <Skeleton className="w-[180px] h-10 rounded-xl" />
            <Skeleton className="w-32 h-10 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-full max-w-md" />
        </CardContent>
      </Card>

      {/* Card: Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MembersListSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
