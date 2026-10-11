import React, { CSSProperties, KeyboardEvent } from 'react';
import { Badge, Box, Text } from 'folds';
import { EmojiBoardTab } from '../types';

const styles: CSSProperties = {
  cursor: 'pointer',
};

const tabs = [
  { value: EmojiBoardTab.SekaiSticker, label: 'SEKAI' },
  { value: EmojiBoardTab.Sticker, label: 'User Stickers' },
  { value: EmojiBoardTab.Emoji, label: 'Emoji' },
];

export function EmojiBoardTabs({
  tab,
  onTabChange,
  panelId,
}: {
  tab: EmojiBoardTab;
  onTabChange: (tab: EmojiBoardTab) => void;
  panelId: string;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    const buttons =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[next].focus();
    onTabChange(tabs[next].value);
  };

  return (
    <Box gap="100" role="tablist" aria-label="Emoji and stickers">
      {tabs.map(({ value, label }, index) => (
        <Badge
          key={value}
          style={styles}
          as="button"
          role="tab"
          aria-selected={tab === value}
          aria-controls={panelId}
          tabIndex={tab === value ? 0 : -1}
          variant="Secondary"
          fill={tab === value ? 'Solid' : 'None'}
          size="500"
          onClick={() => onTabChange(value)}
          onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => handleKeyDown(event, index)}
        >
          <Text as="span" size="L400">
            {label}
          </Text>
        </Badge>
      ))}
    </Box>
  );
}
