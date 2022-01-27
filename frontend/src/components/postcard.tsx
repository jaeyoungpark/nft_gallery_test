import * as React from 'react';
import { styled, SxProps } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

export interface PostCardProps {
   owner: string;
   ownerAddress: string;
   ownerProfileImageUrl: string;
   collection: string;
   message: string;
   imageUrl: string;
   likes: number;
   sx?: SxProps;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export function PostCard(props: PostCardProps) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const { owner, ownerAddress, ownerProfileImageUrl, collection, message, imageUrl, likes} = props;

    return (
        <Card sx={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 345, ...props.sx }}>
            <CardHeader
                avatar={
                    <Avatar src={ownerProfileImageUrl} sx={{ bgcolor: red[500] }} aria-label="recipe"></Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={ owner || ownerAddress }
                subheader={ collection }
            />
            <CardMedia
                component="img"
                image={ imageUrl }
                alt="Paella dish"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    { message }
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteBorder />
                </IconButton>
                { likes }
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="body2" paragraph>Comment goes here</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}