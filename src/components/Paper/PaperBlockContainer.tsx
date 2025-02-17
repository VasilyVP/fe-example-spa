import { ReactNode } from 'react';
import { Grid, GridProps } from '@mui/material';
import PaperCorners from './PaperCorners';

type PaperBlockContainerProps = {
    children?: ReactNode | ReactNode[];
    corners?: boolean;
}
export default ({ children, corners = false, ...props }: PaperBlockContainerProps & GridProps) => {

    return (
        <Grid
            position='relative'
            container
            spacing={((children as ReactNode[])?.length && (children as ReactNode[]).length > 1) ? '2px' : 0}
            borderRadius='16px'
            overflow='hidden'
            {...props}
        >
            {children}
            {corners && <PaperCorners />}
        </Grid>
    )
}
