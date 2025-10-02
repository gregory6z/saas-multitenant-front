import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/dashboard/chatbots/$id/settings/ai")({
  component: AISettingsComponent,
});

function AISettingsComponent() {
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 md:pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">AI Settings</h1>
      </div>

      {/* Model Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select defaultValue="gpt-4o-mini">
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Temperature</Label>
              <span className="text-sm font-medium">{temperature[0]}</span>
            </div>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              max={1}
              step={0.1}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>More focused</span>
              <span>More creative</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Max Tokens</Label>
              <span className="text-sm font-medium">{maxTokens[0]}</span>
            </div>
            <Slider
              value={maxTokens}
              onValueChange={setMaxTokens}
              max={4096}
              min={256}
              step={256}
              className="w-full"
            />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* System Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>System Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="instructions">System Prompt</Label>
            <Textarea
              id="instructions"
              placeholder="Define how your AI should behave..."
              className="min-h-[150px]"
              defaultValue="You are a helpful AI assistant. Respond professionally and provide accurate information."
            />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Response Behavior */}
      <Card>
        <CardHeader>
          <CardTitle>Response Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include sources in responses</Label>
              <p className="text-sm text-muted-foreground">Show source citations when available</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable conversation memory</Label>
              <p className="text-sm text-muted-foreground">
                Remember context from previous messages
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-suggest follow-up questions</Label>
              <p className="text-sm text-muted-foreground">
                Provide suggested questions after responses
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
