/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect } from "react";
import pluginId from "../../pluginId";
import { useTranslation } from "../../hooks/useTranslation";
import { useConfirmDialog } from "../../contexts/ConfirmDialogContext";
import { axiosInstance } from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import {
  BaseHeaderLayout,
  Box,
  Typography,
  Flex,
  Button,
  ContentLayout,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  VisuallyHidden,
  IconButton,
} from "@strapi/design-system";
import Pencil from "@strapi/icons/Pencil";
import PaperPlane from "@strapi/icons/PaperPlane";
import Eye from "@strapi/icons/Eye";

// service layer
const setNewsletterSended = async (newsletterId) =>
  axiosInstance.post(`/${pluginId}/setIsSended`, {
    id: newsletterId,
  });

const normalizeStrapiNewsletterToTheAcousticShape = (strapiNewsletter) => {
  // return strapiNewsletter
  // TODO: add data normalization for compatible shape with the IBM
  try {
    const data = {
      currencyOnePair: strapiNewsletter.currencyOnePair,
      currencyOneText: strapiNewsletter.currencyOneText,
      currencyTwoPair: strapiNewsletter.currencyTwoPair,
      currencyTwoText: strapiNewsletter.currencyTwoText,
      newsletterDailyMessages: strapiNewsletter.newsletterDailyMessages.map(
        (n) => ({
          country: n.country,
          estimated: n.estimated,
          previous: n.previous,
          subject: n.subject,
          time: n.time,
        })
      ),
      newsletterFreeMessages: strapiNewsletter.newsletterFreeMessages.map(
        (n) => ({
          subject: n.subject,
          text: n.text,
        })
      ),
      published: strapiNewsletter.published,
      signature: {
        address: strapiNewsletter.signature.address,
        email: strapiNewsletter.signature.email,
        name: strapiNewsletter.signature.name,
        phone: strapiNewsletter.signature.phone,
        photo: strapiNewsletter.signature.photo,
        position: strapiNewsletter.signature.position,
        url: strapiNewsletter.signature.url,
      },
      subject: strapiNewsletter.subject,
    };
    return data;
  } catch (err) {
    console.warn(err);
    window.alert("invalid newsletter data");
    return null;
  }
};

const detailPath =
  "/content-manager/collectionType/plugin::acoustic-newsletters.newsletter";
const locationPath = "/plugins/acoustic-newsletters";

const HomePage = ({ newsletterUrl }) => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showConfirmDialog } = useConfirmDialog();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axiosInstance.get(`/${pluginId}`);
      console.log("data", data);
      setNewsletters(Array.isArray(data) ? data : []);
    };

    fetchData();
  }, []);

  const sendNewsletter = async (newsletterId) => {
    const shouldSend = await showConfirmDialog(
      t("homepage.list.item.confirm.title"),
      t("homepage.list.item.confirm.message")
    );

    if (!shouldSend) {
      return;
    }

    const newsletterData = await createPreview(newsletterId);
    if (!newsletterData) {
      window.alert("error while creating newsletter ");
    }

    setLoading(true);
    try {
      // https://clevercmssit.creditas.cleverlance.com/capi/swagger-ui.html#!/Newsletter/sendNewsletterUsingPOST
      await window.fetch(`${newsletterUrl}/send`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          mailingId: newsletterData.mailingId,
        }),
      });

      await setNewsletterSended(newsletterId);
      window.alert("Newsletter odeslán");
      setNewsletters((newsletters) =>
        newsletters.map((n) =>
          n.id === newsletterId ? { ...n, isSended: true } : n
        )
      );
    } catch (err) {
      console.error(err);
      window.alert(err);
    }
    setLoading(false);

    // normalize data into acoustic shape
    // read acoustic IBM URL from the configuration
    // send dat to the acoustic
  };

  const createPreview = async (newsletterId) => {
    const newsletter = newsletters.find(({ id }) => id === newsletterId);
    const newsletterToSend =
      normalizeStrapiNewsletterToTheAcousticShape(newsletter);
    if (!newsletterToSend) {
      return;
    }
    setLoading(true);
    try {
      // https://clevercmssit.creditas.cleverlance.com/capi/swagger-ui.html#!/Newsletter/createNewsletterUsingPOST
      const res = await window.fetch(`${newsletterUrl}/create`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(newsletterToSend),
      });

      const data = await res.json();
      setLoading(false);
      return data;
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <BaseHeaderLayout title={t("homepage.title")} as="h2"></BaseHeaderLayout>
      <ContentLayout>
        <Table>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">{t("subject")}</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">{t("updatedAt")}</Typography>
              </Th>
              <Th>
                <VisuallyHidden>Actions</VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {newsletters
              .sort(
                (a, b) =>
                  Date.parse(new Date(b.updatedAt)) -
                  Date.parse(new Date(a.updatedAt))
              )
              .map((newsletter) => (
                <Tr key={newsletter.id}>
                  <Td>
                    <Typography>{newsletter.subject}</Typography>
                  </Td>
                  <Td>
                    <Typography>
                      {new Date(newsletter.updatedAt).toLocaleDateString() +
                        " " +
                        new Date(newsletter.updatedAt).toLocaleTimeString()}
                    </Typography>
                  </Td>
                  <Td style={{ width: "8rem" }}>
                    <Flex>
                      <Link
                        to={`${detailPath}/${newsletter.id}?redirectUrl=${locationPath}`}
                      >
                        <IconButton
                          label={t("homepage.edit.button")}
                          noBorder
                          icon={<Pencil />}
                        />
                      </Link>
                      <IconButton
                        onClick={async () => {
                          const newsletterData = await createPreview(
                            newsletter.id
                          );
                          if (newsletterData) {
                            window.open(newsletterData.previewLink);
                          }
                        }}
                        label={t("homepage.newsletter.showPreview.button")}
                        noBorder
                        icon={<Eye />}
                      />
                      <IconButton
                        onClick={() => sendNewsletter(newsletter.id)}
                        label={t("homepage.newsletter.send.button")}
                        noBorder
                        icon={<PaperPlane />}
                        disabled={newsletter.isSended || loading}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </ContentLayout>
    </>
  );
};

export default HomePage;
