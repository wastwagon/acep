"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { whistleblowerCategories } from "@/lib/data/tax";

export function WhistleblowerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    entityName: "",
    entityType: "",
    violationDescription: "",
    evidence: "",
    anonymous: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase 2, this will submit to the backend API
    console.log("Whistleblower report submitted:", formData);
    setSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        entityName: "",
        entityType: "",
        violationDescription: "",
        evidence: "",
        anonymous: false,
      });
    }, 5000);
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Report Submitted Successfully!</h3>
          <p className="text-slate-600 mb-4">
            Your report has been received. Our team will review it and contact you if additional information is needed.
          </p>
          <p className="text-sm text-slate-500">
            Report ID: {Math.random().toString(36).substring(2, 9).toUpperCase()}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg bg-acep-primary/10 p-2">
            <Shield className="h-6 w-6 text-acep-primary" />
          </div>
          <div>
            <CardTitle>Report Tax Violation</CardTitle>
            <CardDescription>
              Confidential reporting system with rewards from GH¢25,000 to GH¢250,000
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Your Report is Confidential</p>
              <p>
                All information provided is kept strictly confidential. Rewards are paid only after 
                validation and successful recovery. You can choose to remain anonymous.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Your Information</h3>
            
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.anonymous}
                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                className="rounded border-slate-300"
              />
              <label htmlFor="anonymous" className="text-sm text-slate-700">
                Submit anonymously (no contact information required)
              </label>
            </div>

            {!formData.anonymous && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required={!formData.anonymous}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-acep-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required={!formData.anonymous}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-acep-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required={!formData.anonymous}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-acep-primary"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Violation Information */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-slate-900">Violation Details</h3>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                Violation Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-acep-primary"
              >
                <option value="">Select a category</option>
                {whistleblowerCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="entityName" className="block text-sm font-medium text-slate-700 mb-1">
                  Entity/Company Name *
                </label>
                <input
                  type="text"
                  id="entityName"
                  required
                  value={formData.entityName}
                  onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-acep-primary"
                  placeholder="Name of the entity involved"
                />
              </div>

              <div>
                <label htmlFor="entityType" className="block text-sm font-medium text-slate-700 mb-1">
                  Entity Type *
                </label>
                <select
                  id="entityType"
                  required
                  value={formData.entityType}
                  onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-acep-primary"
                >
                  <option value="">Select type</option>
                  <option value="Individual">Individual</option>
                  <option value="Business">Business/Company</option>
                  <option value="Government">Government Entity</option>
                  <option value="NGO">NGO/Non-Profit</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="violationDescription" className="block text-sm font-medium text-slate-700 mb-1">
                Detailed Description of Violation *
              </label>
              <textarea
                id="violationDescription"
                required
                rows={6}
                value={formData.violationDescription}
                onChange={(e) => setFormData({ ...formData, violationDescription: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-acep-primary"
                placeholder="Provide as much detail as possible about the tax violation, including dates, amounts, and any relevant information..."
              />
            </div>

            <div>
              <label htmlFor="evidence" className="block text-sm font-medium text-slate-700 mb-1">
                Evidence/Supporting Documents
              </label>
              <textarea
                id="evidence"
                rows={3}
                value={formData.evidence}
                onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-acep-primary"
                placeholder="Describe any evidence you have (documents, records, witnesses, etc.). In Phase 2, file uploads will be available."
              />
            </div>
          </div>

          {/* Reward Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Reward Information</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Rewards range from GH¢25,000 to GH¢250,000</li>
              <li>• Payment is made only after validation and successful recovery</li>
              <li>• Rewards are calculated as a percentage of recovered amounts</li>
              <li>• All information is kept strictly confidential</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="h-12 w-full text-lg bg-acep-primary hover:bg-acep-primary/90">
            <Shield className="mr-2 h-5 w-5" />
            Submit Report
          </Button>

          <p className="text-xs text-slate-500 text-center">
            By submitting this form, you confirm that the information provided is accurate to the best of your knowledge.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
