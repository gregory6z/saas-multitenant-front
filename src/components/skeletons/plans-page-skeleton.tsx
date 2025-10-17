import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PlansPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto pt-4 md:pt-8 px-4 md:px-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Título e Plano Atual */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-72" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <Skeleton className="h-10 w-80" />
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="relative flex flex-col h-full">
            <CardHeader className="text-center pb-4">
              {/* Title */}
              <Skeleton className="h-8 w-32 mx-auto mb-4" />

              {/* Price */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-40 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-grow pt-0">
              {/* Features List */}
              <ul className="space-y-2 mb-6">
                {[1, 2, 3, 4, 5].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 min-h-[28px]">
                    <Skeleton className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <Skeleton className="h-4 flex-1" />
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Skeleton className="h-10 w-full mt-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
