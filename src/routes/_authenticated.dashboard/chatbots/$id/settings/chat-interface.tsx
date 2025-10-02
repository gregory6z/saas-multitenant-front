import { createFileRoute } from "@tanstack/react-router";
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
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/$id/settings/chat-interface")({
  component: ChatInterfaceSettingsComponent,
});

function ChatInterfaceSettingsComponent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Chat Interface</h1>
      </div>

      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="welcome">Initial Message</Label>
            <Textarea
              id="welcome"
              placeholder="Welcome message users see when they start chatting"
              defaultValue="Hi! What can I help you with?"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Input Placeholder</Label>
            <Input
              id="placeholder"
              placeholder="Placeholder text for the input field"
              defaultValue="Message..."
            />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select defaultValue="light">
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex gap-2">
              <Input id="primary-color" type="color" defaultValue="#0066ff" className="w-20 h-10" />
              <Input defaultValue="#0066ff" className="flex-1" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Features */}
      <Card>
        <CardHeader>
          <CardTitle>Chat Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show typing indicator</Label>
              <p className="text-sm text-muted-foreground">
                Display animation when AI is responding
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show timestamps</Label>
              <p className="text-sm text-muted-foreground">Display message timestamps</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable message reactions</Label>
              <p className="text-sm text-muted-foreground">Allow users to react to messages</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show "Powered by" branding</Label>
              <p className="text-sm text-muted-foreground">Display RagBoost branding in chat</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Chat Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="message-limit">Messages per session</Label>
            <Input
              id="message-limit"
              type="number"
              placeholder="0 for unlimited"
              defaultValue="50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-limit">Rate limit (messages per minute)</Label>
            <Input
              id="rate-limit"
              type="number"
              placeholder="Rate limit per user"
              defaultValue="10"
            />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
