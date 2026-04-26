"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const regions = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
  "Northern", "Upper East", "Upper West", "Volta", "Bono",
  "Bono East", "Ahafo", "Oti", "Western North", "North East", "Savannah"
];

const categories = [
  "Power Outage",
  "Meter Issues",
  "Billing Problems",
  "Electrical Faults",
  "Service Quality",
  "Connection Request",
  "Other"
];

export function ComplaintForm() {
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    district: "",
    category: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/public/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "ELECTRICITY_COMPLAINT", data: formData }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; retryAfterSec?: number };
      if (res.status === 429) {
        setErr(`Too many requests. Try again in ${data.retryAfterSec ?? 60}s.`);
        return;
      }
      if (!res.ok || !data.ok) {
        setErr(data.error === "invalid_data" ? "Please check required fields." : "Could not submit. Try again later.");
        return;
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          region: "",
          district: "",
          category: "",
          description: "",
        });
      }, 4000);
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
            <p className="text-slate-600">
              Your complaint has been submitted successfully. We&apos;ll review it and take appropriate action.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
          Submit a Complaint
        </CardTitle>
        <CardDescription>
          Help us improve Ghana&apos;s power sector by reporting issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
          {err && <p className="text-sm text-red-600">{err}</p>}
          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-acep-secondary">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-acepBtn focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-acep-secondary">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-acepBtn focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number <span className="text-acep-secondary">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-acepBtn focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="+233 XX XXX XXXX"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-slate-700 mb-2">
                Region <span className="text-acep-secondary">*</span>
              </label>
              <select
                id="region"
                name="region"
                required
                value={formData.region}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-acepBtn focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-medium text-slate-700 mb-2">
                District/Town <span className="text-acep-secondary">*</span>
              </label>
              <input
                type="text"
                id="district"
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-acepBtn focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="Enter district or town"
              />
            </div>
          </div>

          {/* Complaint Details */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
              Issue Category <span className="text-acep-secondary">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-acepBtn focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Description <span className="text-acep-secondary">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-acepBtn focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
              placeholder="Please provide details about the issue you're experiencing..."
            ></textarea>
            <p className="mt-1 text-xs text-slate-500">
              Provide as much detail as possible to help us address your concern
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-acepCard p-4">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> Your report is stored securely for ACEP staff review. For emergencies involving immediate danger, contact your
              utility or emergency services directly.
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Submitting…" : "Submit complaint"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
