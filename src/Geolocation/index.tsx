import React from "react";

export interface IGeoLocation {
	status: "success" | "error" | "idle";
	position?: GeolocationPosition;
	error?: GeolocationPositionError;
}

const initValue: IGeoLocation = {
	status: "idle",
	position: undefined,
	error: undefined,
};
const GeolocationContext = React.createContext<IGeoLocation>(initValue);

export const GeolocationProvider: React.FC<any> = ({ children }) => {
	const [geolocation, setGeolocation] = React.useState(initValue);

	React.useEffect(() => {
		const watchId = navigator.geolocation.watchPosition(
			(position) => setGeolocation({ status: "success", position }),
			(error) => setGeolocation({ status: "error", error })
		);

		return () => navigator.geolocation.clearWatch(watchId);
	});

	return (
		<GeolocationContext.Provider value={geolocation}>
			{children}
		</GeolocationContext.Provider>
	);
};

export const useGeolocation = () => {
	const geolocation = React.useContext(GeolocationContext);
	if (!geolocation)
		throw new Error(
			"useGeolocation must be used within a GeolocationProvider"
		);
	return geolocation;
};
