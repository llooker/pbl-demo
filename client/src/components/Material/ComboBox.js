/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ComboBox(props) {
    // console.log('ComboBox');
    // console.log('props', props);
    const { options, action, correspondingContentId, filterName } = props


    const handleChange = (event) => {
        action(event.target.innerText || '', correspondingContentId, filterName)
    }

    return (
        <Autocomplete
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option.label}
            style={{ width: 300 }}
            // onChange={() => action(event, correspondingContentId, filterName)}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label={filterName} variant="outlined" />}
        />
    );
}


