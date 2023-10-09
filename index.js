import {writeFile} from 'node:fs/promises';
import casual from 'casual';

const requestDefinition = {
    createPeople: {
        method: 'post',
        url: 'http://localhost:3000/people',
        getPayload: () => {
            const payload = {
                name: casual.name,
                email: casual.email,
                phone: casual.phone,
            };
            console.log({payload});
            return payload;
        },
        getHeaders: () => null,
    },
};

const requestExecution = {
    getItalents: {
        iterations: 7000,
        results: [],
    },
}

function computeSummary(execution) {
    const summary = {
        success: 0,
        fail: 0,
        averageResponseTime: null,
    };
    for (const requestKey of Object.keys(execution)) {
        const results = execution[requestKey].results;
        let sum = 0;
        for (const result of results) {
            sum += result.responseTime;
            if (result.status === 'error' || result.status >= 400) {
                summary.fail += 1;
            } else {
                summary.success += 1;
            }
        }
        summary.averageResponseTime = sum / results.length;
    }
    return summary;
}

async function saveJson(name, object) {
    return writeFile(name, JSON.stringify(object, null, 2), {
        encoding: 'utf-8',
    })
}

async function doRequestAndSaveResult(requestKey) {
    const {url, method, getPayload, getHeaders} = requestDefinition[requestKey];
    const headers = getHeaders();
    const payload = getPayload();
    const start = performance.now();
    const result = {
        name: requestKey,
    };
    try {
        const response = await fetch(url, {
            body: payload ? payload : undefined,
            method,
            headers: headers ? headers : undefined,
        });
        result.status = response.status;
        result.statusText = response.statusText;
        result.ok = response.ok;
    } catch (error) {
        result.status = 'error';
        result.message = error.message;
    } finally {
        const end = performance.now();
        result.responseTime = end - start;
        requestExecution[requestKey].results.push(result);
    }
}

async function main() {
    const promises = [];
    for (const requestKey of Object.keys(requestExecution)) {
        for (let i = 0; i < requestExecution[requestKey].iterations; i++) {
            promises.push(doRequestAndSaveResult(requestKey));
        }
    }
    await Promise.allSettled(promises);
    console.time('files');
    await saveJson('summary.json', computeSummary(requestExecution))
    await saveJson('request-execution.json', requestExecution);
    console.timeEnd('files');
}


console.time('total');
main().then(r => {
    console.timeEnd('total');
});
















