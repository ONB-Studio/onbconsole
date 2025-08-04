// src/lib/gscSync.ts
import { google } from 'googleapis';
import pool from './pg';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export async function syncGSC(accessToken: string, siteUrl: string, siteId: string) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: formatDate(thirtyDaysAgo),
        endDate: formatDate(today),
        dimensions: ['date'],
      },
    });

    const rows = res.data.rows;
    if (!rows) return { success: true, message: 'No data to sync.' };

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM next_auth.metrics WHERE site_id = $1', [siteId]);

      for (const row of rows) {
        const [date] = row.keys!;
        const clicks = row.clicks!;
        const impressions = row.impressions!;
        const ctr = row.ctr!;
        const position = row.position!;

        await client.query(
          `INSERT INTO next_auth.metrics (site_id, date, clicks, impressions, ctr, position)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [siteId, date, clicks, impressions, ctr, position]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return { success: true, message: 'Sync completed successfully.' };
  } catch (error) {
    console.error('Error syncing GSC data:', error);
    return { success: false, message: 'Failed to sync GSC data.' };
  }
}
