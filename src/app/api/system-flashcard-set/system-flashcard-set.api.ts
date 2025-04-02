import axiosClient from "@/lib/axiosClient";
import { FlashcardSchema } from "@/schema/flashcard";
import { SystemFlashcardSetSchema } from "@/schema/system-flashcard-set";
import { CreateSystemFlashcardSetResponse, SystemFlashcardSet } from "@/types/system-flashcard-set";
import { z } from "zod";

const ENDPOINT = {
    CREATE_SET : '/system-flashcard-set/create',
    GET_BY_ID : '/system-flashcard-set/getSysFlashcardSet',
    UPDATE_PUBLIC_STATUS : '/system-flashcard-set/update-visibility',
    UPDATE : '/system-flashcard-set/update',
    DELETE_FLASHCARD : '/flashcard/delete',
    CREATE_FLASHCARDS : '/flashcard',
    UPDATE_FLASHCARD : '/flashcard'
}

export const createSysFlashcardSet = async (token : string, values: z.infer<typeof SystemFlashcardSetSchema>) :Promise<CreateSystemFlashcardSetResponse> => {
    const response = await axiosClient.post(ENDPOINT.CREATE_SET,
        {
            title: values.title,
            description : values.description,
            difficultyLevel : values.difficultyLevel,
            isPublic : values.isPublic,
            isPremium : values.isPremium
        },
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const getSysFlashcardSetById = async (token : string, setId : number) : Promise<SystemFlashcardSet>  => {
    const response = await axiosClient.get(`${ENDPOINT.GET_BY_ID}/${setId}`,
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data.data
}

export const updateFlashcardSetPublicStatus = async (token : string, setId : number, publicStatus : boolean)  => {
    console.log('token in api:', token);
    
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE_PUBLIC_STATUS}/${setId}?isPublic=${publicStatus}`,
        {},
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const updateSysFlashcardSet = async (token : string, values: z.infer<typeof SystemFlashcardSetSchema>, setId : number) :Promise<CreateSystemFlashcardSetResponse> => {
    const response = await axiosClient.patch(`${ENDPOINT.UPDATE}/${setId}`,
        {
            title: values.title,
            description : values.description,
            difficultyLevel : values.difficultyLevel,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const deleteFlashcard = async (token : string, flashcardId : number) => {
    const response = await axiosClient.delete(`${ENDPOINT.DELETE_FLASHCARD}/${flashcardId}`,
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}

type FormattedFlashcard = {
    japaneseDefinition: string;
    vietEngTranslation: string;
    imageUrl: string | null;
};

export const createFlashcards = async (token : string, setId : number, flashcards : FormattedFlashcard[]) => {
    const response = await axiosClient.post(`${ENDPOINT.CREATE_FLASHCARDS}/${setId}/systemCreate`,
        flashcards,
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const updateFlashard = async (token : string,  flashcard : z.infer<typeof FlashcardSchema>) => {
    const reponse = await axiosClient.patch(`${ENDPOINT.UPDATE_FLASHCARD}/${flashcard.flashcardId}/update`,
    {
        japaneseDefinition : flashcard.japaneseDefinition,
        vietEngTranslation : flashcard.vietEngTranslation,
        imageUrl : flashcard.imageUrl
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
            }
    }
    )
    return reponse.data
}