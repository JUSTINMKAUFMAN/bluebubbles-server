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

export interface ApiKeyFieldProps {
    helpText?: string;
    errorOnEmpty?: boolean
}

export const ApiKeyField = ({ helpText, errorOnEmpty = false }: ApiKeyFieldProps): JSX.Element => {
    const dispatch = useAppDispatch();

    const apiKey: string = (useAppSelector(state => state.config.apiKey) ?? '');
    const [showApiKey, setShowApiKey] = useBoolean();
    const [newApiKey, setNewApiKey] = useState(apiKey);
    const [apiKeyError, setApiKeyError] = useState('');
    const hasApiKeyError: boolean = (apiKeyError?? '').length > 0;

    useEffect(() => {
        setNewApiKey(apiKey);
    }, [apiKey]);

    useEffect(() => {
        if (errorOnEmpty && apiKey.length === 0) {
            setApiKeyError('Enter an API Key, then click the save button');
        }
    }, []);

    /**
     * A handler & validator for saving a new apiKey.
     *
     * @param theNewApiKey - The new apiKey to save
     */
    const saveApiKey = (theNewApiKey: string): void => {
        // Validate the port
        if (theNewApiKey.length < 3) {
            setApiKeyError('Your apiKey must be at least 3 characters!');
            return;
        } else if (theNewApiKey === apiKey) {
            setApiKeyError('You have not changed the apiKey since your last save!');
            return;
        }

        dispatch(setConfig({ name: 'apiKey', value: theNewApiKey }));
        if (hasApiKeyError) setApiKeyError('');
        showSuccessToast({
            id: 'settings',
            description: 'Successfully saved new apiKey!'
        });
    };

    return (
        <FormControl isInvalid={hasApiKeyError}>
            <FormLabel htmlFor='apiKey'>API Key</FormLabel>
            <Input
                id='apiKey'
                type={showApiKey ? 'text' : 'password'}
                maxWidth="20em"
                value={newApiKey}
                onChange={(e) => {
                    if (hasApiKeyError) setApiKeyError('');
                    setNewApiKey(e.target.value);
                }}
            />
            <IconButton
                ml={3}
                verticalAlign='top'
                aria-label='View apiKey'
                icon={showApiKey ? <AiFillEye /> : <AiFillEyeInvisible />}
                onClick={() => setShowApiKey.toggle()}
            />
            <IconButton
                ml={3}
                verticalAlign='top'
                aria-label='Save apiKey'
                icon={<AiOutlineSave />}
                onClick={() => saveApiKey(newApiKey)}
            />
            {!hasApiKeyError ? (
                <FormHelperText>
                    {helpText ?? 'Enter the API Key to use with your webhook'}
                </FormHelperText>
            ) : (
                <FormErrorMessage>{apiKeyError}</FormErrorMessage>
            )}
        </FormControl>
    );
};