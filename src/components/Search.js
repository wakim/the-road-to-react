import React from 'react';
import DebounceInput from 'react-debounce-input';

export default function Search({value, onChange, children}) {
  return (
    <form>
      {children}
      <DebounceInput
        type="text"
        debounceTimeout={300}
        value={value}
        onChange={(e) => onChange(e.target.value)} />
    </form>
  );
}
