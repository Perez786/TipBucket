'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Template {
  _id: string;
  templateName: string;
  employees: any[];
  scenario: string;
}

export default function TemplatesDashboard() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/templates');
        if (!response.ok) throw new Error('Failed to fetch templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleUseTemplate = (template: Template) => {
    console.log("--- STEP 1: 'Use' button clicked. ---");

    // ✅ Pass template ID in URL instead of using localStorage
    router.push(`/use-template?id=${template._id}`);
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/templates/edit/${templateId}`);
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const res = await fetch(`/api/templates/${templateId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setTemplates(templates.filter((t) => t._id !== templateId));
        } else {
          console.error('Failed to delete template');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Templates</h1>
        <Link href="/templates/new" className="btn btn-primary">
          Create New Template
        </Link>
      </div>

      {templates.length > 0 ? (
        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template._id} className="card bg-base-100 shadow-md">
              <div className="card-body flex-row justify-between items-center">
                <div>
                  <h2 className="card-title">{template.templateName}</h2>
                  <p className="text-sm text-gray-500">
                    {template.employees.length} employees | Scenario: {template.scenario}
                  </p>
                </div>
                <div className="card-actions justify-end space-x-2">
                  <button
                    onClick={() => handleEditTemplate(template._id)}
                    className="btn btn-ghost btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="btn btn-primary btn-sm"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">You have not created any templates yet.</p>
          <Link href="/templates/new" className="btn btn-primary mt-4">
            Create Your First Template
          </Link>
        </div>
      )}
    </div>
  );
}
