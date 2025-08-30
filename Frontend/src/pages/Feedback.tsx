import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export default function Feedback() {
  const [name, setName] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [rating, setRating] = useState("");
  const [sending, setSending] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE || "https://baootamadu.onrender.com/api";

  const handleSubmit = async () => {
    if (!name || !suggestion || !rating) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill all fields before submitting.",
      });
      return;
    }

    setSending(true);

    const feedbackHTML = `
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h2>📋 New Feedback Received</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Suggestion:</b> ${suggestion}</p>
          <p><b>Rating (out of 10):</b> ${rating}</p>
        </body>
      </html>
    `;

    const emailPayload = {
      to: "jayanthdn6073@gmail.com", // Change to your recipient email
      subject: `New Feedback from ${name}`,
      htmlContent: feedbackHTML,
    };

    try {
      const res = await fetch(`${API_URL}/send-bill-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "✅ Feedback submitted",
          description: "Your feedback has been sent successfully!",
        });

        // Reset form
        setName("");
        setSuggestion("");
        setRating("");
      } else {
        throw new Error(data.error || "Failed to send feedback");
      }
    } catch (err: any) {
      console.error("❌ Feedback send failed:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Could not send feedback. Try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Feedback Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Suggestion */}
          <div className="space-y-2">
            <Label htmlFor="suggestion">Your Suggestion</Label>
            <Textarea
              id="suggestion"
              placeholder="Write your suggestion here..."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rate the Project (1–10)</Label>
            <Select value={rating} onValueChange={(val) => setRating(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={`${i + 1}`}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            className="w-full mt-4"
            onClick={handleSubmit}
            disabled={sending}
          >
            {sending ? "Sending..." : "Submit Feedback"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
