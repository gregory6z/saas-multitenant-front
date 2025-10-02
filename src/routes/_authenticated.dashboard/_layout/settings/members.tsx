import { createFileRoute } from "@tanstack/react-router";
import { Mail, MoreHorizontal, Plus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/settings/members")({
  component: MembersPage,
});

function MembersPage() {
  const { t } = useTranslation("common");

  const members = [
    {
      id: "1",
      name: "Gregory Praxedes",
      email: "gregory@demo.com",
      role: "Owner",
      avatar: "",
      status: "Active",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@demo.com",
      role: "Admin",
      avatar: "",
      status: "Active",
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane@demo.com",
      role: "Member",
      avatar: "",
      status: "Pending",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("sidebar.members")}</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Invite Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite New Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Enter email address" className="flex-1" />
            <Button>Send Invite</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Invited members will receive an email to join your workspace.
          </p>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      member.role === "Owner"
                        ? "default"
                        : member.role === "Admin"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {member.role}
                  </Badge>
                  <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                  {member.role !== "Owner" && (
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Owner</p>
                <p className="text-sm text-muted-foreground">
                  Full access to all features and settings
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-sm text-muted-foreground">
                  Can manage members, chatbots, and most settings
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Member</p>
                <p className="text-sm text-muted-foreground">
                  Can create and manage chatbots, limited settings access
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
