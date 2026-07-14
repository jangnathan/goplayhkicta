export const LocationEnum = {
    VICTORIA_PARK_COURTS: 1,
    HAPPEY_VALLEY: 2,
    KOWLOON_PARK: 3,
    KINGS_PARK: 4,
    HONG_KONG_INTERNATIONAL_SCHOOL: 5,
    ISLAND_SCHOOL_SPORTS_HALL: 10,
    ISLAND_SCHOOL_PITCH: 11,
    WEST_ISLAND_SCHOOL_PITCH: 12,
};

export const LocationDetails = {
    [LocationEnum.VICTORIA_PARK_COURTS]: {
        name: "Victoria Park Basketball Court #2",
        lat: 22.2822,
        lng: 114.1895
    },
    [LocationEnum.HAPPEY_VALLEY]: {
        name: "Happy Valley Recreational Ground",
        lat: 22.2750,
        lng: 114.1720
    },
    [LocationEnum.KOWLOON_PARK]: {
        name: "Kowloon Park 7-a-side pitch",
        lat: 22.2951,
        lng: 114.1685
    },
    [LocationEnum.KINGS_PARK]: {
        name: "Kings Park Sports GROUND",
        lat: 22.3100,
        lng: 114.1900
    },
    [LocationEnum.HONG_KONG_INTERNATIONAL_SCHOOL]: {
        name: "Hong Kong International School",
        lat: 22.2760,
        lng: 114.1520
    },
    [LocationEnum.ISLAND_SCHOOL_PITCH]: {
        name: "Island School Sports Pitch",
        lat: 22.2755,
        lng: 114.1550
    },
    [LocationEnum.WEST_ISLAND_SCHOOL_PITCH]: {
        name: "West Island School Sports Pitch",
        lat: 22.2750,
        lng: 114.1500
    }
};

export const LocationGroups = {
    "Hong Kong Island": [
        LocationEnum.VICTORIA_PARK_COURTS,
        LocationEnum.HAPPEY_VALLEY,
        LocationEnum.KINGS_PARK,
        LocationEnum.HONG_KONG_INTERNATIONAL_SCHOOL,
        LocationEnum.ISLAND_SCHOOL_PITCH,
        LocationEnum.WEST_ISLAND_SCHOOL_PITCH
    ],
    "Kowloon": [
        LocationEnum.KOWLOON_PARK
    ]
};