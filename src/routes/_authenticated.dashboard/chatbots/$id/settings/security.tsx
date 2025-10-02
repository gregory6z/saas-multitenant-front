import { createFileRoute } from "@tanstack/react-router";
import { Globe, Key, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/$id/settings/security")({
  component: SecuritySettingsComponent,
});

function SecuritySettingsComponent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Security</h1>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Security settings help protect your chatbot from unauthorized access and misuse.
        </AlertDescription>
      </Alert>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Access Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="access-level">Access Level</Label>
            <Select defaultValue="public">
              <SelectTrigger>
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can access</SelectItem>
                <SelectItem value="private">Private - Requires authentication</SelectItem>
                <SelectItem value="whitelist">Whitelist - Specific domains only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input id="api-key" type="password" defaultValue="sk-xxxxxxxxxxxxxxxx" readOnly />
              <Button variant="outline" size="sm">
                Regenerate
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Domain Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Domain Restrictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable domain restrictions</Label>
              <p className="text-sm text-muted-foreground">
                Only allow chatbot to work on specific domains
              </p>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowed-domains">Allowed Domains</Label>
            <Input id="allowed-domains" placeholder="example.com, app.example.com" disabled />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable rate limiting</Label>
              <p className="text-sm text-muted-foreground">
                Prevent abuse by limiting requests per user
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requests-per-minute">Requests per minute</Label>
              <Input id="requests-per-minute" type="number" defaultValue="60" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requests-per-hour">Requests per hour</Label>
              <Input id="requests-per-hour" type="number" defaultValue="1000" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Filtering */}
      <Card>
        <CardHeader>
          <CardTitle>Content Filtering</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable content moderation</Label>
              <p className="text-sm text-muted-foreground">
                Filter inappropriate content automatically
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Block personal information</Label>
              <p className="text-sm text-muted-foreground">
                Prevent sharing of emails, phone numbers, etc.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Log conversations</Label>
              <p className="text-sm text-muted-foreground">Keep logs for security and analytics</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
