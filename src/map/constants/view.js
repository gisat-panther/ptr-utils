/* Used to sync view between 3D and 2D projections. At average latitude is the distortion smallest.
/* TODO configurable */
const averageLatitude = 50;

/* Constants for levels-based map view handling */
/* TODO enable custom levels range */
const numberOfLevels = 20;
const defaultLevelsRange = [0,19];
const zoomCoefficient = 250;

/* Default box range limits */
const maxBoxRange = 50000000;
const minBoxRange = 1;

/* Pixel size in different zoom levels
http://docs.opengeospatial.org/is/17-083r2/17-083r2.html#59 */
const pixelSizeInLevelsDefault = [
    156543.0339280410,
    78271.51696402048,
    39135.75848201023,
    19567.87924100512,
    9783.939620502561,
    4891.969810251280,
    2445.984905125640,
    1222.992452562820,
    611.4962262814100,
    305.7481131407048,
    152.8740565703525,
    76.43702828517624,
    38.21851414258813,
    19.10925707129406,
    9.554628535647032,
    4.777314267823516,
    2.388657133911758,
    1.194328566955879,
    0.5971642834779395,
    0.2985821417389697,
    0.1492910708694849,
    0.07464553543474244,
    0.03732276771737122,
    0.01866138385868561,
    0.009330691929342805
];

const getPixelSizeInLevelsForLatitude = (pixelSizeInLevels, latitude) => pixelSizeInLevels.map(size => size*Math.cos(Math.PI*latitude/180));

const pixelSizeInLevels = getPixelSizeInLevelsForLatitude(pixelSizeInLevelsDefault, averageLatitude);

export default {
    averageLatitude,
    numberOfLevels,
    defaultLevelsRange,
    getPixelSizeInLevelsForLatitude,
    maxBoxRange,
    minBoxRange,
    pixelSizeInLevels,
    zoomCoefficient,
}