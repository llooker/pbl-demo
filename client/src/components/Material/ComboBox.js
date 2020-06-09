/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ComboBox(props) {
    // console.log('ComboBox');
    // console.log('props', props);
    const { options, action, correspondingContentId, filterName, value } = props


    const handleChange = (event) => {
        if (correspondingContentId) action(correspondingContentId, filterName, event.target.innerText || '')
        else action(event.target.innerText || '')
    }

    return (
        <Autocomplete
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option.label}
            style={{ width: 300 }}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label={filterName} variant="outlined" />}
            value={value || ''}
        />
    );
}


