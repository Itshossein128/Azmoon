import { Switch as HeadlessSwitch } from '@headlessui/react';
import { useState } from 'react';

interface SwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function Switch({ label, enabled, onChange }: SwitchProps) {
  return (
    <HeadlessSwitch.Group as="div" className="flex items-center justify-between">
      <HeadlessSwitch.Label as="span" className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </HeadlessSwitch.Label>
      <HeadlessSwitch
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-full' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          dir="ltr"
        />
      </HeadlessSwitch>
    </HeadlessSwitch.Group>
  );
}
