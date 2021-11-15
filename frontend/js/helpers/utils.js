export const parseRequestURL = () => {
    const url = location.hash.slice(2),
        request = {};

    [request.resource, request.id, request.placeId, request.action] = url.split('/');

    return request;
};