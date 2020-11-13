import { render } from '@testing-library/react'
import React from 'react'

export type DashboardCardProps = {
    children?: any
    height: number
}

export default function DashboardCard(props: DashboardCardProps) {

    let style = {
        height: props.height,
    };

    return (
        <React.Fragment>
            <div className="border border-info p-0" style={style}>
                {props.children}
            </div>
        </React.Fragment>
    );
}