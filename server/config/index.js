const CHURCH_ID = process.env.FIREBASE_CHURCH_COLLECTION;

export const COLLECTIONS = {
    users: `${CHURCH_ID}_users`,
    purposes: `${CHURCH_ID}_purposes`,
    donations: `${CHURCH_ID}_donations`,
    refreshToken: `${CHURCH_ID}_refreshTokens`
};
