import { Router, Request, Response } from 'express';
import { FeedItem } from './../models/FeedItem';
import * as AWS from './../../../../aws';
import { Http } from './../../util/http';

const router: Router = Router();
const http: Http = new Http();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
            if(item.url) {
                item.url = AWS.getGetSignedUrl(item.url);
            }
    });
    res.send(items);
});

// Get a specific resource
router.get('/:id', 
    async (req: Request, res: Response) => {
    let { id } = req.params;
    const item = await FeedItem.findByPk(id);
    res.send(item);
});

// update a specific resource
router.patch('/:id',  
    async (req: Request, res: Response) => {
        //@TODO try it yourself
        let { id } = req.params;
        let item: FeedItem = await FeedItem.findByPk(id);
        
        await FeedItem.update({caption: item.caption+'!'}, {where: {id: item.id}}).then(result => {
            res.status(201).send(result);
        });
});


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', 
    async (req: Request, res: Response) => {
    const { fileName } = req.params;
    console.log('AAAA')
    console.log(req.body)

    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Get a signed url to get a item in the S3 bucket
router.get('/signed-url/get/:fileName',
    async (req: Request, res: Response) => {
        let { fileName } = req.params;
        const url = AWS.getGetSignedUrl(fileName);
        
        res.status(201).send({url: url})
    }
);

// router.get('/teste/get/', async (req: Request, res: Response) => {
//     let fileName = 'C:/Users/yurig/OneDrive/Imagens/yuri.jpg'
//     http.get(`/filteredimage/?image_url=${fileName}`).then(response => {
//         const filtered = response.data;
//         res.status(201).send({filtered})
//     }).catch(err => {
//         console.log(err + ': ERROR');
//     });
// });


// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/', 
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });

    const saved_item = await item.save();

    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;