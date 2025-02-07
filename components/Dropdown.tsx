// @ts-nocheck
import React, { useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Select,
  Stack,
  FormControl,
  FormLabel,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { useLocationStore } from '../lib/store';
import { DataItem } from '../types';
import { slugify } from '../lib/utils';

interface DropdownProps {
  data: DataItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ data }) => {
  const router = useRouter();
  const {
    selectedIl,
    selectedIlce,
    selectedMahalle,
    setSelectedIl,
    setSelectedIlce,
    setSelectedMahalle,
  } = useLocationStore();

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    if (!selectedIl) {
      setSelectedIlce('');
      setSelectedMahalle('');
    }
  }, [selectedIl, setSelectedIlce, setSelectedMahalle]);

  useEffect(() => {
    if (!selectedIlce) {
      setSelectedMahalle('');
    }
  }, [selectedIlce, setSelectedMahalle]);

  const uniqueIller = useMemo(() => {
    return [...new Set(data.map(item => item.il))]
      .sort((a, b) => a.localeCompare(b, 'tr'));
  }, [data]);

  const ilceler = useMemo(() => {
    if (!selectedIl) return [];
    return [...new Set(data.filter(item => item.il === selectedIl).map(item => item.ilce))]
      .sort((a, b) => a.localeCompare(b, 'tr'));
  }, [data, selectedIl]);

  const mahalleler = useMemo(() => {
    if (!selectedIl || !selectedIlce) return [];
    const mahalleList = data.find(item => item.il === selectedIl && item.ilce === selectedIlce)?.mahalle || [];
    return [...mahalleList].sort((a, b) => a.localeCompare(b, 'tr'));
  }, [data, selectedIl, selectedIlce]);

  const labelColor = useColorModeValue('gray.700', 'white');
  const selectColor = useColorModeValue('gray.800', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleIlChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedIl(value);
    setSelectedIlce('');
    setSelectedMahalle('');
  };

  const handleIlceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedIlce(value);
    setSelectedMahalle('');
  };

  const handleMahalleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMahalle(value);
    if (value && selectedIl && selectedIlce) {
      const path = `/mahalle/${slugify(selectedIl)}/${slugify(selectedIlce)}/${slugify(value)}`;
      router.push(path);
    }
  };

  const selectStyles = {
    bg: useColorModeValue('white', 'gray.800'),
    color: selectColor,
    borderColor: borderColor,
    _hover: {
      borderColor: 'orange.300',
    },
    _focus: {
      borderColor: 'orange.400',
      boxShadow: '0 0 0 1px var(--chakra-colors-orange-400)',
    },
  };

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel color={labelColor}>İl</FormLabel>
        <Select
          value={selectedIl}
          onChange={handleIlChange}
          placeholder="İl seçiniz"
          {...selectStyles}
        >
          {uniqueIller.map((il) => (
            <option key={il} value={il}>{il}</option>
          ))}
        </Select>
      </FormControl>

      {selectedIl && (
        <FormControl>
          <FormLabel color={labelColor}>İlçe</FormLabel>
          <Select
            value={selectedIlce}
            onChange={handleIlceChange}
            placeholder="İlçe seçiniz"
            {...selectStyles}
          >
            {ilceler.map((ilce) => (
              <option key={ilce} value={ilce}>{ilce}</option>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedIlce && (
        <FormControl>
          <FormLabel color={labelColor}>Mahalle</FormLabel>
          <Select
            value={selectedMahalle}
            onChange={handleMahalleSelect}
            placeholder="Mahalle seçiniz"
            {...selectStyles}
          >
            {mahalleler.map((mahalle) => (
              <option key={mahalle} value={mahalle}>{mahalle}</option>
            ))}
          </Select>
        </FormControl>
      )}
    </Stack>
  );
};

export default Dropdown; 