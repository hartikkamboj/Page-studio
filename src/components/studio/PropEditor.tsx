'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSectionProps } from '@/store/slices/draftPageSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

/**
 * Prop editor: renders a form for the currently selected section.
 * Fields are dynamically generated based on section type.
 */
export default function PropEditor() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((s) => s.ui.selectedSectionId);
  const section = useAppSelector((s) =>
    s.draftPage.page?.sections.find((sec) => sec.id === selectedId)
  );

  if (!section) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-sm text-slate-500">
        Select a section to edit its properties.
      </div>
    );
  }

  const handleChange = (key: string, value: unknown) => {
    dispatch(updateSectionProps({ sectionId: section.id, props: { [key]: value } }));
  };

  return (
    <div className="flex-1 overflow-y-auto border-t border-slate-800">
      <div className="p-4">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Edit: {section.type}
        </h3>
        <Separator className="mb-4" />

        <div className="space-y-4">
          {section.type === 'hero' && (
            <HeroFields props={section.props} onChange={handleChange} />
          )}
          {section.type === 'cta' && (
            <CTAFields props={section.props} onChange={handleChange} />
          )}
          {section.type === 'testimonial' && (
            <TestimonialFields props={section.props} onChange={handleChange} />
          )}
          {section.type === 'featureGrid' && (
            <FeatureGridFields props={section.props} onChange={handleChange} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Field groups per section type ──

function HeroFields({
  props,
  onChange,
}: {
  props: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <FieldInput
        label="Headline"
        value={(props.headline as string) || ''}
        onChange={(v) => onChange('headline', v)}
        required
      />
      <FieldTextarea
        label="Subtext"
        value={(props.subtext as string) || ''}
        onChange={(v) => onChange('subtext', v)}
        required
      />
      <FieldInput
        label="CTA Label"
        value={(props.ctaLabel as string) || ''}
        onChange={(v) => onChange('ctaLabel', v)}
      />
      <FieldInput
        label="CTA URL"
        value={(props.ctaUrl as string) || ''}
        onChange={(v) => onChange('ctaUrl', v)}
        type="url"
      />
    </>
  );
}

function CTAFields({
  props,
  onChange,
}: {
  props: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <FieldInput
        label="Heading"
        value={(props.heading as string) || ''}
        onChange={(v) => onChange('heading', v)}
        required
      />
      <FieldTextarea
        label="Description"
        value={(props.description as string) || ''}
        onChange={(v) => onChange('description', v)}
      />
      <FieldInput
        label="Button Label"
        value={(props.buttonLabel as string) || ''}
        onChange={(v) => onChange('buttonLabel', v)}
        required
      />
      <FieldInput
        label="Button URL"
        value={(props.buttonUrl as string) || ''}
        onChange={(v) => onChange('buttonUrl', v)}
        type="url"
        required
      />
    </>
  );
}

function TestimonialFields({
  props,
  onChange,
}: {
  props: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <FieldTextarea
        label="Quote"
        value={(props.quote as string) || ''}
        onChange={(v) => onChange('quote', v)}
        required
      />
      <FieldInput
        label="Author"
        value={(props.author as string) || ''}
        onChange={(v) => onChange('author', v)}
        required
      />
      <FieldInput
        label="Role / Title"
        value={(props.role as string) || ''}
        onChange={(v) => onChange('role', v)}
      />
    </>
  );
}

function FeatureGridFields({
  props,
  onChange,
}: {
  props: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  const features = (props.features as Array<{ title: string; description: string }>) || [];

  const updateFeature = (index: number, key: 'title' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [key]: value };
    onChange('features', newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    onChange('features', newFeatures);
  };

  const addFeature = () => {
    const newFeatures = [...features, { title: 'New Feature', description: 'Feature description' }];
    onChange('features', newFeatures);
  };

  return (
    <div className="space-y-6">
      <FieldInput
        label="Heading"
        value={(props.heading as string) || ''}
        onChange={(v) => onChange('heading', v)}
        required
      />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300">Feature Items</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addFeature}
            className="h-7 border-slate-700 bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Plus className="mr-1 h-3 w-3" /> Add Feature
          </Button>
        </div>

        {features.length === 0 ? (
          <p className="text-xs text-slate-500">No features added yet.</p>
        ) : (
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="relative rounded-md border border-slate-700 bg-slate-900/50 p-3 pt-4">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeFeature(index)}
                  className="absolute right-1 top-1 text-slate-500 hover:bg-red-500/20 hover:text-red-400"
                  aria-label="Remove feature"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-3">
                  <FieldInput
                    label={`Feature ${index + 1} Title`}
                    value={feature.title || ''}
                    onChange={(v) => updateFeature(index, 'title', v)}
                    required
                  />
                  <FieldTextarea
                    label="Description"
                    value={feature.description || ''}
                    onChange={(v) => updateFeature(index, 'description', v)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Reusable field components ──

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      <Label htmlFor={id} className="text-slate-300">
        {label}
        {required && <span className="ml-1 text-red-400" aria-label="required">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 bg-slate-900 border-slate-700 text-white"
        aria-required={required}
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      <Label htmlFor={id} className="text-slate-300">
        {label}
        {required && <span className="ml-1 text-red-400" aria-label="required">*</span>}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 bg-slate-900 border-slate-700 text-white"
        rows={3}
        aria-required={required}
      />
    </div>
  );
}
