export interface Overlord {
    age: number;
    allegiance: string;
    anathema: boolean;
    anathemabribe: number;
    anathemadeclaredcount: number;
    anathemadeclarer: string;
    anathemadeclarername: string;
    anathemadeclarerrarity: number;
    anathemareason: string;
    anathematime: number;
    ap: number;
    class: string;
    collection: string;
    continent: string;
    domain: string;
    feudallord: string;
    feudallordname: string;
    feudaltime: number;
    gender: string;
    group_attack: string;
    has_secret: string;
    hp: number;
    isatwar: boolean;
    ismarried: boolean;
    isoverlord: boolean;
    issworn: boolean;
    item: string;
    lives: number;
    lovercount: number;
    magic: number;
    marriagetime: number;
    maxdefensivepower: number;
    maxpowerpotential: number;
    members: number;
    name: string;
    nftcontractid: string;
    nftindex: number;
    nftselfcontractaddress: string;
    nfturi: string;
    overlord: string;
    overlordname: string;
    overlordrarity: number;
    owner: string;
    potentialmarriage: string;
    rarity: number;
    solo_attack: string;
    stars: number;
    subdomain: string;
    title: string;
    unique_trait: string;
    vote: number;
    votetime: number;
    votingpower: number;
    warstarted: number;
    wartarget: string;
    wartargetname: string;
    wife: string;
    wisdom: number;
}

async function getOverlords(): Promise<Overlord[]> {
    const response = await fetch('http://localhost:4000/overlords', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();
    return data as Overlord[];
}

export default getOverlords;


async function getUnderlords(): Promise<Overlord[]> {
    const response = await fetch('http://localhost:4000/underlords', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch underlord data from server');
    }

    const data = await response.json();
    return data as Overlord[];
}

async function getSubjects(feudallord: string): Promise<Overlord[]> {
    const response = await fetch(`http://localhost:4000/overlordmembers/${feudallord}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();
    return data as Overlord[];
}


async function getattackers(wartarget: string): Promise<Overlord[]> {
    const response = await fetch(`http://localhost:4000/wartarget/${wartarget}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();
    return data as Overlord[];
}

async function getAnathemaDeclarerDeclarations(anathemaDeclarer: string): Promise<Overlord[]> {
    const response = await fetch(`http://localhost:4000/anathemadeclarations/${anathemaDeclarer}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();
    return data as Overlord[];
}

async function getSingleNftData(selfcontractaddress: string): Promise<Overlord> {
    const response = await fetch(`http://localhost:4000/singlenftdata/${selfcontractaddress}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();
    return data as Overlord; // Assuming Overlord is your data type
}

async function getElectionVoteCounts(electionid: number): Promise<string[]> {
    const response = await fetch(`http://localhost:4000/election/${electionid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }
    console.log(response)
    const data = await response.json();
    return data; // Assuming Overlord is your data type
}



export { getOverlords, getSubjects, getattackers, getAnathemaDeclarerDeclarations, getSingleNftData, getElectionVoteCounts, getUnderlords };