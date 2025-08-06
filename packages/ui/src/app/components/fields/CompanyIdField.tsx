import React, { useEffect, useState } from 'react';
import {
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    IconButton,
    FormErrorMessage,
    useBoolean
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { showSuccessToast } from '../../utils/ToastUtils';
import { setConfig } from '../../slices/ConfigSlice';
import { AiFillEye, AiFillEyeInvisible, AiOutlineSave } from 'react-icons/ai';


export interface CompanyIdFieldProps {
    helpText?: string;
    errorOnEmpty?: boolean
}

export const CompanyIdField = ({ helpText, errorOnEmpty = false }: CompanyIdFieldProps): JSX.Element => {
    const dispatch = useAppDispatch();

    const companyId: string = (useAppSelector(state => state.config.companyId) ?? '');
    const [showCompanyId, setShowCompanyId] = useBoolean();
    const [newCompanyId, setNewCompanyId] = useState(companyId);
    const [companyIdError, setCompanyIdError] = useState('');
    const hasCompanyIdError: boolean = (companyIdError?? '').length > 0;

    useEffect(() => {
        setNewCompanyId(companyId);
    }, [companyId]);

    useEffect(() => {
        if (errorOnEmpty && companyId.length === 0) {
            setCompanyIdError('Enter a companyId, then click the save button');
        }
    }, []);

    /**
     * A handler & validator for saving a new companyId.
     *
     * @param theNewCompanyId - The new companyId to save
     */
    const saveCompanyId = (theNewCompanyId: string): void => {
        // Validate the port
        if (theNewCompanyId.length < 3) {
            setCompanyIdError('Your companyId must be at least 3 characters!');
            return;
        } else if (theNewCompanyId === companyId) {
            setCompanyIdError('You have not changed the companyId since your last save!');
            return;
        }

        dispatch(setConfig({ name: 'companyId', value: theNewCompanyId }));
        if (hasCompanyIdError) setCompanyIdError('');
        showSuccessToast({
            id: 'settings',
            description: 'Successfully saved new companyId!'
        });
    };

    return (
        <FormControl isInvalid={hasCompanyIdError}>
            <FormLabel htmlFor='companyId'>Server CompanyId</FormLabel>
            <Input
                id='companyId'
                type={showCompanyId ? 'text' : 'companyId'}
                maxWidth="20em"
                value={newCompanyId}
                onChange={(e) => {
                    if (hasCompanyIdError) setCompanyIdError('');
                    setNewCompanyId(e.target.value);
                }}
            />
            <IconButton
                ml={3}
                verticalAlign='top'
                aria-label='View companyId'
                icon={showCompanyId ? <AiFillEye /> : <AiFillEyeInvisible />}
                onClick={() => setShowCompanyId.toggle()}
            />
            <IconButton
                ml={3}
                verticalAlign='top'
                aria-label='Save companyId'
                icon={<AiOutlineSave />}
                onClick={() => saveCompanyId(newCompanyId)}
            />
            {!hasCompanyIdError ? (
                <FormHelperText>
                    {helpText ?? 'Enter the companyId that this account belongs to'}
                </FormHelperText>
            ) : (
                <FormErrorMessage>{companyIdError}</FormErrorMessage>
            )}
        </FormControl>
    );
};