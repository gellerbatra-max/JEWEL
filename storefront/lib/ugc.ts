// Client-safe types for the "Loved by Influencers" shoppable carousel. Store
// lives in ./ugc-store.ts.

export type UgcPost = {
  id: string;
  media: string; // uploaded video or image path
  productHandle: string; // the piece this post features
  name: string; // influencer / handle label (optional, e.g. "@aisha")
  createdAt: string;
};

// A post resolved with its linked product, ready for display.
export type UgcCard = {
  id: string;
  media: string;
  name: string;
  product: {
    handle: string;
    title: string;
    image: string;
    price: number;
    currency: string;
    oneOfAKind: boolean;
  };
};

export const isVideoMedia = (s: string) => /\.(mp4|webm|mov|m4v)$/i.test(s);
