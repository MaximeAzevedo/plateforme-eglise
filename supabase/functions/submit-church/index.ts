import { google } from 'npm:googleapis@126';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SPREADSHEET_ID = '1Ujg28qNIwsgc6pQvsM-83Tp76pxt8r2_8Nv9u5fKhXM';
const CREDENTIALS = {
  type: 'service_account',
  project_id: 'exportation-bdd',
  private_key_id: 'e82293c43c2189f30ff1a5a29cf8b9871d6f1c6c',
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCElOlwTDLzyDda\nM4mfKblzokIZC4p8LXgJgLe+/YACp4hrmTRXPrYiwmJMKQdKd+YUOQOUJmcssA33\n4uDAPGbD4Hano+jI7yEjcVXvQBOJ0hHo3jeNVtkKtCLBx+5WibN7F4dVPiPx8kpe\nol9L+gThROteenx5qon0nucNHroHQnDozo+X8DGxNsS1VzPKUvw1C0QzkkYRMrkZ\nhJMaigqoncZSBWIqqpMcd8/l47PGlyxVCxCXAAQIWgWAV+G+g2zOgyHxRM/okAgt\nYjcQW7JCZyhEW8D2qhgHmFtsRJzWhWAhqivqRdv7uNxM5z4r+dW7P82UjBe1R6hQ\n1BeyCrnlAgMBAAECggEAMJ7zpO0s2l4Yfonb9HS2wANHPiwPU07RcJq1x+LraQ3L\nZ7o9ialD3idvKQL624Jw7AWknFYhDDBcTwXy6ky8WyUcHopruhSIEJllrGHRSH+z\ndbTYpoqs+dHp1Sre6vmAyqlsRgSN5hK211GwpQpBc+N0dadxsqSqBv2nOhaEnlhm\nMlosn5UWHZlVmmI/ibJHq9Qx0hGXMBNGFxLRQIm1hrWJl5iYdSUrKUMgEqZQQi2D\ncds1DQ92C1yQYuQO01pgY9HdeOtxUAPQxLHUhE5bXrvNHwBUyfi1c4U4mFiIXri0\nVK5hfpayX/bBo9afJy/Rs90EUFkaFWODU94s92z62QKBgQC52h86EQhIg83xAM4b\nTUWBbxZ0PdZPZVzleVk+1rfMmhgjpDeiYuatwYOOpLWibmbS9nZKkcoTzpQYWQWv\nyhvNksMOSd9XAbC9p+bwnIV7XtLrIwCkwB6IAnyG4mZdD1lK0oJAz084Kx0M4srf\nyaodyc/pyUNdqYoFN2Wb5RXThwKBgQC2n5BOahCEk5tIBgAYjZCFov/O+iZ3SCyX\nt62jF+0wsfhDt/wPxsSYfSn3nKxCCcuyGpMUthtMNDTgOnfG5C4mGgDeARKqGLsc\nKQpw2CTefZagVJ37qJuLzKtkFXSpv3Lyl3OFepzQx19QP+gPEw2l4aTOElYZvAHi\ngQ4vOFM6MwKBgGxk4heMvYcFkIRCUvMrcyFVeAQd2LN/y9lul/WFZ7dmHDQVX/lO\ns3mdxqvYNrNgronWAxHky7YXoto8eYuYVfTk5uybey4Up09F8PReZZ+Zo2xOgt6T\nynrK8HP+8XLPM+Xmtt8zyeFZi9zrHSW+SYCMJr4UizzCV+RI9fMhfkRbAoGADhVU\nDZgEWhT//pfn3fzczlF5pL6JxN0eAz04+MDZm829tYs0twq/EntkhyHf7t/Og5el\nDA3XIRNNmJUps37ZSDrtIjG2/MMXet53Xahtf3Lz8L1VyZiBFlDcTsWQz55iAO9J\nC1wfR8J4SToEbVUs0kQKb5HebfGfu5X0QBP55x0CgYEAlojCA7zoZfOUO9WRhFtS\nKO3RQpF1pzbD4ubS/U3NUoxmQqrlbt04b2jAfPL5UnOgLyOpGlQWFbk+YPp4TPkZ\n9nbLEWfU8CNA9bt1P1ixC/PyBTH/gVVBoMiTgWUEZuXr12i4jUwL7e78ELOjoaAK\n6zq0qma8lGXwnatM2aBL5NU=\n-----END PRIVATE KEY-----\n",
  client_email: 'bdd-glise@exportation-bdd.iam.gserviceaccount.com',
  client_id: '107913892283284804300',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/bdd-glise%40exportation-bdd.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com'
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const data = await req.json();
    console.log('Received data:', data);

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('Auth initialized');

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('Sheets client created');

    // Format the data for Google Sheets
    const row = [
      data.name,
      data.denomination,
      data.address,
      data.department,
      data.postalCode,
      data.city,
      data.openingHours,
      data.schedules,
      data.website || '',
      data.accessibility ? 'Oui' : 'Non',
      'Non', // Validation status
      new Date().toISOString(), // Submission date
    ];

    console.log('Attempting to append row:', row);

    // Append the data to the "Propositions" sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Propositions!A:L',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log('Sheets API response:', response);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return new Response(
      JSON.stringify({ 
        error: 'Failed to submit data',
        details: error.message,
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});