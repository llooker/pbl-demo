/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ComboBox(props) {
    // console.log('ComboBox');
    // console.log('props', props);
    const { options, customFilterSelect, correspondingContentId, filterName } = props

    return (
        <Autocomplete
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option.label}
            style={{ width: 300 }}
            onChange={() => customFilterSelect(event, correspondingContentId, filterName)}
            renderInput={(params) => <TextField {...params} label={filterName} variant="outlined" />}
        />
    );
}


