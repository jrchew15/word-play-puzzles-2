import React from 'react';
import { appUseSelector, totalState } from "../../store";
import { user } from '../../classes/types';
import { Route, Redirect, RouteProps } from 'react-router-dom';

// prevents access to users not signed in
const ProtectedRoute = (props: RouteProps) => {
    const currentUser: user = appUseSelector((state: totalState) => state.user)
    return (
        <Route {...props}>
            {(currentUser) ? props.children : <Redirect to='/unauthorized' />}
        </Route>
    )
};


export default ProtectedRoute;
