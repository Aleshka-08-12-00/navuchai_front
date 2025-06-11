import React, { useState } from 'react';
import { Input } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import styles from './SearchInput.module.scss';

const { Search } = Input;

type SearchInputProps = {
  onSearch: (value: string) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchValue?: string) => {
    const query = searchValue ?? value;
    setLoading(true);
    onSearch(query);
    setTimeout(() => setLoading(false), 500);
  };

  const clearInput = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={styles.searchWrapper}>
      <Search
        placeholder="Поиск по таблице..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={handleSearch}
        enterButton="Поиск"
        loading={loading}
        allowClear={{
          clearIcon: (
            <CloseCircleFilled
              className={styles.clearIcon}
              onClick={clearInput}
            />
          ),
        }}
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchInput;
