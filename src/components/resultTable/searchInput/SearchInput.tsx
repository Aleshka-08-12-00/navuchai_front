import React, { useState } from 'react';
import { Input, Space } from 'antd';

const { Search } = Input;

type SearchInputProps = {
  onSearch: (value: string) => void; 
};

const SearchInput: React.FC<SearchInputProps> = ({onSearch}) => {
  const [loading, setLoading] = useState(false); 

  const handleSearch = (value: string) => {
    setLoading(true);
    console.log(value);
    
   
    setTimeout(() => {
      setLoading(false); 
    }, 2000);

    onSearch(value);
  };

  return (
    <Space direction="vertical">
      <Search
        placeholder="Поиск по таблице..."
        onSearch={handleSearch}
        enterButton
        loading={loading}
      />
    </Space>
  );
};

export default SearchInput;
