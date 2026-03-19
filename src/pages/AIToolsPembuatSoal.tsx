import { Sparkles, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AI_STUDIO_URL =
  "https://aistudio.google.com/apps/drive/1jaCOIn8Lj4mlCBnIqp8x4oekUALhq5OQ?fullscreenApplet=true&showAssistant=true&showPreview=true";

const GEMINI_SHARE_URL = "https://gemini.google.com/share/128bfa32b749";

export default function AIToolsPembuatSoal() {
  return (
    <div className="max-w-3xl animate-fade-in space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-heading font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            Pusat Alat AI Guru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Card className="shadow-card rounded-2xl">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="text-base font-bold">AI Studio</div>
                <div className="text-xs text-muted-foreground break-all">{AI_STUDIO_URL}</div>
              </div>
              <Button asChild className="h-11 rounded-xl">
                <a href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer">
                  Buka AI Studio <ExternalLink />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card rounded-2xl">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="text-base font-bold">Gemini Share</div>
                <div className="text-xs text-muted-foreground break-all">{GEMINI_SHARE_URL}</div>
              </div>
              <Button asChild variant="secondary" className="h-11 rounded-xl">
                <a href={GEMINI_SHARE_URL} target="_blank" rel="noopener noreferrer">
                  Buka Gemini <ExternalLink />
                </a>
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

