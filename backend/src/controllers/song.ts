import { Request, Response } from 'express';
import { eq } from "drizzle-orm";
import { drizzle as pg } from 'drizzle-orm/node-postgres';
import { drizzle as sqlite } from 'drizzle-orm/libsql';
import { songModel } from '../models/song';

const postgresUrl = process.env.POSTGRES_URL;
const sqliteUrl = process.env.SQLITE_URL;

if (!postgresUrl) {
    throw new Error('POSTGRES_URL is not defined in environment variables.');
}
if (!sqliteUrl) {
    throw new Error('SQLITE_URL is not defined in environment variables.');
}

const pgDB = pg(postgresUrl);
const sqliteDB = sqlite(sqliteUrl);

export const getSongs = async (req: Request, res: Response) => {
    try {
        const songs = await pgDB.select().from(songModel);
        const bmpSongs = await sqliteDB.select().from(songModel);

        res.json({
            songs,
            bmpSongs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching songs' });
    }
};

export const addSong = async (req: Request, res: Response) => {
    const { title, authorId, download, source, comment, tags } = req.body;

    try {
        const newSong = await pgDB
            .insert(songModel)
            .values({
                title,
                download,
                source,
                comment,
                tags,
                authorId
            })
            .returning();

        res.status(201).json({ message: 'Song added successfully', song: newSong });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding song' });
    }
};

export const deleteSong = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await pgDB.delete(songModel).where(eq(songModel.id, Number(id)));

        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting song' });
    }
};
