import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function GeneralPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8 px-4 md:px-6 pb-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Workspace Details Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Subdomain Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-80" />
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-36" />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center">
          <Separator className="flex-1" />
          <Skeleton className="h-4 w-28 mx-6" />
          <Separator className="flex-1" />
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <Skeleton className="h-6 w-44" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-10 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
