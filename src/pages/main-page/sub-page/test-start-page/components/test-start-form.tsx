import React, { useState } from 'react';
import { Button, Checkbox, IconButton, MenuItem, Select, Typography } from '@mui/material';
import {
    Delete as DeleteIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material/';
import MainCard from '../../../../../components/MainCard';

interface Field {
    id: number;
    value: string;
    isRequired: boolean;
}

const TestStartForm: React.FC = () => {
    const [fields, setFields] = useState<Field[]>([]);

    const handleAddField = (): void => {
        setFields([...fields, { id: fields.length, value: "", isRequired: false }]);
    };

    const handleFieldChange = (id: number, value: string): void => {
        setFields(fields.map(field => (field.id === id ? { ...field, value } : field)));
    };

    const handleCheckboxChange = (id: number): void => {
        setFields(fields.map(field => (field.id === id ? { ...field, isRequired: !field.isRequired } : field)));
    };

    const handleDeleteField = (id: number): void => {
        setFields(fields.filter(field => field.id !== id));
    };

    const moveFieldUp = (id: number): void => {
        const index = fields.findIndex(field => field.id === id);
        if (index > 0) {
            const updatedFields = [...fields];
            [updatedFields[index - 1], updatedFields[index]] = [updatedFields[index], updatedFields[index - 1]];
            setFields(updatedFields);
        }
    };

    const moveFieldDown = (id: number): void => {
        const index = fields.findIndex(field => field.id === id);
        if (index < fields.length - 1) {
            const updatedFields = [...fields];
            [updatedFields[index + 1], updatedFields[index]] = [updatedFields[index], updatedFields[index + 1]];
            setFields(updatedFields);
        }
    };


    return (
        <div style={{ marginBottom: 20 }}>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 , opacity: 0.1}}>
                <>
                    <Typography variant="h5" color="textSecondary" style={{ marginBottom: 10 }}   >
                        Форма начала теста
                    </Typography>
                    <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, marginBottom: 20 }} >
                        Настройте форму начала теста и соберите данные для идентификации респондентов.
                    </Typography>
                    <div>
                        {fields.map((field) => (
                            <div key={field.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                <Select
                                    value={field.value}
                                    onChange={(e) => handleFieldChange(field.id, e.target.value as string)}
                                    variant="outlined"
                                    style={{ marginRight: '8px', minWidth: '200px' }}
                                >
                                    <MenuItem value="additionalInfo">Additional information - text area</MenuItem>
                                    <MenuItem value="age">Age - number</MenuItem>
                                    <MenuItem value="city">City - text field</MenuItem>
                                    <MenuItem value="email">E-mail address - email address</MenuItem>
                                    <MenuItem value="firstName">First name - text field</MenuItem>
                                    <MenuItem value="gender">Gender - single choice</MenuItem>
                                    <MenuItem value="idNumber">ID Number - text field</MenuItem>
                                    <MenuItem value="lastName">Last name - text field</MenuItem>
                                    <MenuItem value="nick">Nick - text field</MenuItem>
                                    <MenuItem value="organizationName">Organization name - text field</MenuItem>
                                    <MenuItem value="phone">Phone - text field</MenuItem>
                                    <MenuItem value="postalCode">Postal code - text field</MenuItem>
                                    <MenuItem value="street">Street - text field</MenuItem>
                                </Select>
                                <Checkbox
                                    checked={field.isRequired}
                                    onChange={() => handleCheckboxChange(field.id)}
                                    color="primary"
                                    style={{ marginRight: '8px' }}
                                />
                                <IconButton onClick={() => moveFieldUp(field.id)}>
                                    <ArrowUpwardIcon />
                                </IconButton>
                                <IconButton onClick={() => moveFieldDown(field.id)}>
                                    <ArrowDownwardIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteField(field.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                {field.isRequired && (
                                    <Typography variant="body2" color="error" style={{ marginLeft: '8px' }}>
                                        Required
                                    </Typography>
                                )}
                            </div>
                        ))}
                        <Button disabled variant="contained" color="primary" onClick={handleAddField} style={{ marginRight: '8px' }}>
                            + добавить поле
                        </Button>
                        <Button disabled variant="contained" color="secondary">
                          управление полями
                        </Button>
                    </div>
                </>
            </MainCard>
        </div>

    );
};

export default TestStartForm;
