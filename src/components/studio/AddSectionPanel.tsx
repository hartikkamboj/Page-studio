'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addSection } from '@/store/slices/draftPageSlice';
import type { SectionType } from '@/domain/models/page';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DEFAULT_PROPS: Record<SectionType, Record<string, unknown>> = {
  hero: {
    headline: 'New Hero Section',
    subtext: 'Add your compelling subtext here',
    ctaLabel: 'Learn More',
    ctaUrl: '#',
  },
  featureGrid: {
    heading: 'Our Features',
    features: [
      { title: 'Feature 1', description: 'Description for feature 1' },
      { title: 'Feature 2', description: 'Description for feature 2' },
    ],
  },
  testimonial: {
    quote: 'This is the best product ever!',
    author: 'Jane Doe',
    role: 'CEO, Company Inc',
  },
  cta: {
    heading: 'Ready to start?',
    buttonLabel: 'Get Started',
    buttonUrl: '#',
  },
};

export default function AddSectionPanel() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = (type: SectionType) => {
    dispatch(addSection({ type, props: DEFAULT_PROPS[type] }));
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={<Button variant="secondary" className="w-full justify-center font-medium" />}
      >
        + Add Section
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px]" align="center">
        <DropdownMenuItem onClick={() => handleAdd('hero')}>
          🎯 Hero
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAdd('featureGrid')}>
          📦 Feature Grid
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAdd('testimonial')}>
          💬 Testimonial
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAdd('cta')}>
          🚀 Call to Action
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
