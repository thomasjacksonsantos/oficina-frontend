'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface AutocompleteOption {
  id: string;
  descricao?: string;
  nome?: string;
}

interface AutocompleteProps {
  value?: string;
  onValueChange: (value: string) => void;
  options?: AutocompleteOption[];
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onSearch?: (value: string) => void;
  className?: string;
  label?: string;
}

export function Autocomplete({
  value,
  onValueChange,
  options,
  placeholder = 'Selecione...',
  emptyText = 'Nenhum resultado encontrado.',
  searchPlaceholder = 'Buscar...',
  disabled = false,
  isLoading = false,
  onSearch,
  className,
  label,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  // Ensure options is always treated as an array at runtime to avoid crashes
  const opts = Array.isArray(options) ? options : [];

  const selectedOption = opts.find((option) => option.id === value);
  const displayText = selectedOption
    ? selectedOption.descricao || selectedOption.nome || selectedOption.id
    : value
      ? value
      : placeholder;

  const handleSearch = (search: string) => {
    setSearchValue(search);
    if (onSearch) {
      onSearch(search);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || isLoading}
            className={cn('w-full justify-between', !value && 'text-muted-foreground')}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <span className="truncate">{displayText}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={!onSearch}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={handleSearch}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {opts.map((option) => {
                  const optionText = option.descricao || option.nome || option.id;
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {optionText}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
