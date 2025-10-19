import { AlertTriangle, ArrowRightLeft, UserCog } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TeamMember } from "@/hooks/use-team-members";

interface TransferOwnershipCardProps {
  members: TeamMember[];
  currentUserId: string;
  onTransfer: (newOwnerId: string, newOwnerName: string) => void;
}

export function TransferOwnershipCard({
  members,
  currentUserId,
  onTransfer,
}: TransferOwnershipCardProps) {
  const { t } = useTranslation("settings-members");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  // Filtra para remover o usuário atual da lista
  const eligibleMembers = members.filter((member) => member.id !== currentUserId);

  const handleTransfer = () => {
    const selectedMember = eligibleMembers.find((m) => m.id === selectedMemberId);
    if (selectedMember) {
      onTransfer(selectedMemberId, selectedMember.name);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="w-5 h-5" />
          {t("modals.transferOwnership.title")}
        </CardTitle>
        <CardDescription>{t("modals.transferOwnership.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t("modals.transferOwnership.title")}</AlertTitle>
          <AlertDescription>
            {t("modals.transferOwnership.warning")}
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={t("modals.transferOwnership.description")} />
            </SelectTrigger>
            <SelectContent>
              {eligibleMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="default"
            onClick={handleTransfer}
            disabled={!selectedMemberId}
          >
            <ArrowRightLeft className="w-4 h-4" />
            {t("modals.transferOwnership.confirmButton")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
