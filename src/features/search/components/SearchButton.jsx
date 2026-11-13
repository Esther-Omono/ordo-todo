import { useState } from 'react';
import { Search } from 'lucide-react';

import { Button } from '../../../components/ui';
import SearchModal from './SearchModal';

export default function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant='ghost'
        size='md'
        aria-label='Search tasks'
        title='Search tasks'
        onClick={() => setIsOpen(true)}
      >
        <Search size={19} />
      </Button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
