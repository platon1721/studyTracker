import React from 'react';

import {Redirect} from "expo-router";

const Index = () => {
    return (
        <Redirect href="/(tabs)/subjects" />
    );
};

export default Index;